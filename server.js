'use strict';
const PORT = process.env.PORT || 3030;

const express = require('express');
const superagent = require('superagent');
const path = require('path');

const app = express();
app.use(errorHandler);
app.use(express.static(path.join(__dirname, "public/styles")));
app.use(express.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"))

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
  this.image = (data.volumeInfo.imageLinks) ? data.volumeInfo.imageLinks.smallThumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
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
      return data.body.items.map(element => new Book(element));
    })
    .then(results => res.render('pages/searches/show', {
      searchResults: results
    }));

}





app.get('*', (req, res) => {
  res.status(404).send('Page not found');
  console.log('page not found');
});
app.listen(PORT, () => {
  console.log('Listening on ', PORT);
});