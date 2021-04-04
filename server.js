'use strict';
const PORT = process.env.PORT || 5000;

const express = require("express");
const superagent = require("superagent");
const path = require("path");

const app = express();
// app.use(superagent);

app.use(express.static('public/styles'));
app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');
// app.set('views', path.join(__filename, 'veiws'));

app.get('/searches/new', (req, res) => {
    console.log("inside of searches!!")

    res.render('pages/searches/new');
});

app.get('*', (req, res) => {
    res.status(404).send("Page not found");
    console.log('page not found');
});
app.listen(PORT, () => {
    console.log('Listening on ', PORT);
});