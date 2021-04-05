'use strict';

require("dotenv").config();
const PORT = process.env.PORT || 3000;

const express = require('express');
const superagent = require('superagent');
const path = require('path');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log('PG Error', err));

const app = express();
app.use(errorHandler);
app.use(express.static(path.join(__dirname, "public/styles")));
app.use(express.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));




app.get('/', (req, res) => {
  const SQL = 'SELECT * FROM books';
  console.log('inside get home');
  client.query(SQL).then(result => {
    console.log('inside SQL');
    res.render('index', {book: result.rows});
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
  this.image = (data.volumeInfo.imageLinks) ? data.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
  //solution 1:
  // if (data.volumeInfo.imageLinks)
  // {const regEx='http';
  //   this.image= data.volumeInfo.imageLinks.replace( regEx, 'https');
  // }else{
  //   this.image= 'https://i.imgur.com/J5LVHEL.jpg';
  //   console.log(this.image);

  // }
  // solution 2:
  //   let Regex = /^(http:\/\/)/g;
  //   this.image_url = data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.smallThumbnail.replace(Regex, 'https://') : 'https://i.imgur.com/J5LVHEL.jpg';
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
      return data.body.items.filter(element => element.volumeInfo.authors).map(elem => new Book(elem));
    })
    .then(results => res.render('pages/searches/show', {
      searchResults: results
    }));

}

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
  console.log('page not found');
});



client.connect().then(()=> {
  app.listen(PORT, () => {
    console.log('Listening on ', PORT);
  });


app.get('/books/:id',(req,res)=>{
  let unique = req.params.id;
  let SQL = `SELECT * FROM books WHERE id = '${unique}';`;
          client.query(SQL)
          .then(data =>{
              

              res.render('pages/books/details',{details:data.rows[0]});
          })
})

app.get('/books',(req,res))
const SQL2 = 'SELECT * from books';
client.query(SQL2).then(result=> {
    response.render('pages/books/show', {result: result.rows});

});

