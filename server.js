'use strict';

require("dotenv").config();
const PORT = process.env.PORT || 5050;

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

app.put('/books/:id', updateOnebook);



app.get('/', (req, res) => {
  const SQL = 'SELECT books.id,authors.name,books.title,books.description,books.image_url,books.isbn,books.bookshelf from books join authors on authors.id=books.author_id;';
  client.query(SQL).then(result => {
    console.log(result.rows);
    res.render('pages/index', {
      books: result.rows
    }).catch(err => console.log(err));
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
  this.author = data.volumeInfo.authors ? data.volumeInfo.authors.join(', ') : 'N/A';
  this.description = data.volumeInfo.description || 'N/A';
  this.isbn = (data.volumeInfo.industryIdentifiers) ? data.volumeInfo.industryIdentifiers[0].identifier : 'N/A';
  this.bookshelf = data.volumeInfo.categories ? data.volumeInfo.categories[0] : 'N/A';
  this.image = (data.volumeInfo.imageLinks) ? /^https/i.test(data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail : data.volumeInfo.imageLinks.thumbnail.replace(/^http/i, 'https') : 'https://i.imgur.com/J5LVHEL.jpg';
}


app.delete('/book/:id', deleteBook);

function deleteBook(req, res) {
  const id = req.params.id;
  const SQL = 'DELETE from books WHERE id=$1';
  client.query(SQL, [id])
    .then(() => res.redirect('/'))
    .catch(er => {
      console.log(er);
    });
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
      return data.body.items
        .map(elem => {
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
  const SQL = `INSERT INTO books (title,isbn,image_url ,  description, bookshelf,author_id) VALUES ($1, $2 ,$3, $4, $5, $6) RETURNING *`;
  const values = [title, isbn, image, description, bookshelf];

  client.query('select * from authors where name=$1;', [author]).then(data => {
    if (data.rows.length > 0) {
      client.query(SQL, [...values, data.rows[0].id]).then(returned => {
        res.redirect(`/books/show/${returned.rows[0].id}`);
      }).catch(err => console.log('error on inserting if\n', err));
    } else {
      client.query('insert into authors (name) values ($1) RETURNING *;', [author]).then(data2 => {
        client.query(SQL, [...values, data2.rows[0].id]).then(ret => res.redirect(`/books/show/${ret.rows[0].id}`))
          .catch(err => console.log('error in inserting into books else', err));
      }).catch(err => console.log('error in inserting into authors else', err));
    }
  }).catch(err => console.log('Error in author query\n', err));
}





app.get('/books/:action/:id', (req, res) => {
  let unique = req.params.id;
  let SQL = `SELECT books.id,authors.name,books.title,books.description,books.image_url,books.isbn,books.bookshelf from books join authors on authors.id=books.author_id WHERE books.id = '${unique}';`;
  client.query(SQL)
    .then(data => {
      console.log(data.rows);
      res.render('pages/books/show', {
        details: data.rows[0],
        action: req.params.action
      });
    })
    .catch(er => {
      console.log(er);
    });
});

app.get('/books', (req, res) => {
  const SQL2 = 'SELECT * from books';
  client.query(SQL2)
    .then(result => {
      res.render('pages/books/show', {
        searchResults: result.rows
      });
    })
    .catch(er => {
      console.log(er);
    });
});







function updateOnebook(req, res) {
  const id = req.params.id;
  const image = req.body.bookimage;
  const title = req.body.booktitle;
  const author = req.body.bookauthor;
  const description = req.body.bookdescription;
  const isbn = req.body.bookisbn;
  const bookshelf = req.body.bookshelf;

  const val = [image, title, description, isbn, bookshelf, id];
  console.log(val);
  const SQL = `UPDATE books
                        SET
                          image_url=$1, title=$2, description=$3, ISBN=$4, bookshelf=$5
                        WHERE
                          id=$6;`;

  client.query(SQL, val).then(() => {
    res.redirect(`/books/show/${id}`);
  }).catch(er => {
    console.log(er);
  });

}

client.connect().then(
  app.listen(PORT, () => {
    console.log('Listeneing on', PORT);
  })
);
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
  console.log('page not found');
});