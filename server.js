'use strict';
const PORT = process.env.PORT || 5000;

const express = require('express');
const superagent = require('superagent');
const path = require('path');

const app = express();
// app.use(superagent);

app.use(express.static('public/styles'));
app.use(express.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
// app.set('views', path.join(__filename, 'veiws'));

app.get('/searches/new', (req, res) => {
  console.log('inside of searches!!');

  res.render('pages/searches/new');
});

app.post('/searches', getData);

function Book (data) {
  this.title = data.volumeInfo.title;
  this.author = data.volumeInfo.authors.join(', ');
  this.description = data.volumeInfo.description;
  this.image = (data.volumeInfo.imageLinks)? data.volumeInfo.imageLinks.smallThumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
}

function getData (req, res) {

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (req.body['search-by'] === 'title') { url += `+intitle:${req.body['search-by']}`; }
  if (req.body['search-by'] === 'author') { url += `+inauthor:${req.body['search-by']}`;}
  superagent.get(url).then(data => {
    let resultArr = data.body.items.map(element => {
    //   console.log(element);
    //   console.log(element.volumeInfo.imageLinks);

      return new Book(element);
    });
    res.send(resultArr);
  });
}
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
  console.log('page not found');
});
app.listen(PORT, () => {
  console.log('Listening on ', PORT);
});
