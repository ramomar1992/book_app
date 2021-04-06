'use strict';

require("dotenv").config();
const PORT = process.env.PORT;

const express = require('express');
const superagent = require('superagent');
const path = require('path');
const pg = require('pg');
var methodOverride = require('method-override');
const app = express();

app.use(methodOverride('_method'));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log('PG Error', err));

app.use(errorHandler);
app.use(express.static(path.join(__dirname, "public/styles")));
app.use(express.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));




app.get('/', (req, res) => {
  const SQL = 'SELECT * FROM books';
  client.query(SQL).then(result => {
    res.render('pages/index', {
      books: result.rows
    });
  });
});

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('pages/error', {
    error: err
  });
}

app.post('/searches', getData);

function Book(data) {
  this.title = data.volumeInfo.title;
  this.author = data.volumeInfo.authors.join(', ');
  this.description = data.volumeInfo.description;
  this.isbn = data.volumeInfo.industryIdentifiers[0].identifier;
  this.bookshelf = data.volumeInfo.categories[0];
  this.image = (data.volumeInfo.imageLinks) ? /^https/i.test(data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail : data.volumeInfo.imageLinks.thumbnail.replace(/^http/i, 'https') : 'https://i.imgur.com/J5LVHEL.jpg';
}


app.delete('/book/:id', deleteBook);

function deleteBook(req, res) {
  const id = req.params.id;
  const SQL='DELETE from books WHERE id=$1';
  client.query(SQL, [id]).then(() => res.redirect('/')
  );
}

function getData(req, res) {

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body['search-by'] === 'title') {
    url += `+intitle:${req.body['name']}`;
  }
  if (req.body['search-by'] === 'author') {
    url += `+inauthor:${req.body['name']}`;
  }
  superagent.get(url).then(data => {
      return data.body.items.filter(element => {
        return element.volumeInfo.authors && element.volumeInfo.description && element.volumeInfo.categories;
      }).map(elem => {
        let dataEl = new Book(elem);
        return dataEl;
      });
    })
    .then(results => res.render('pages/searches/show', {
      searchResults: results
    }));

}
app.post('/add-book', saveData);

function saveData(req, res) {
  const image = req.body.bookimg;
  const title = req.body.booktitle;
  const author = req.body.bookauther;
  const description = req.body.bookdescription;
  const isbn = req.body.bookisbn;
  const bookshelf = req.body.bookshelf;

  const values = [image, title, author, description, isbn, bookshelf];
  const SQL = `INSERT INTO books (bookImage, title, author, bookDescription, isbn, bookshelf) VALUES ($1, $2 ,$3, $4, $5, $6) RETURNING *`;
  client.query(SQL, values).then((data) => {
    res.redirect(`/books/${data.rows[0].id}`);
  });
}





app.get('/books/:id', (req, res) => {
  let unique = req.params.id;
  let SQL = `SELECT * FROM books WHERE id = '${unique}';`;
  client.query(SQL)
    .then(data => {
      console.log(data.rows);
      res.render('pages/books/show', {
        details: data.rows[0]
      });
    });
});

app.get('/books', (req, res) => {
  const SQL2 = 'SELECT * from books';
  client.query(SQL2)
    .then(result => {
      res.render('pages/books/show', {
        searchResults: result.rows
      });
    });
});

client.connect().then(
  app.listen(PORT, () => {
    console.log('Listeneing on', PORT);
  })
);
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
  console.log('page not found');
});