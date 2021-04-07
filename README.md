# BookiTupia

**Author**: Omar Ramadan
**Version**: 1.4

## Overview

This application is a book searching app, where you can serach from Google's book database and save details about these books on your profile. You have the ability to add more books, edit the details of the book, and removed the books you already saved from the previous searches.

## Getting Started

The application needs a web browser, Google Chrome latest edition is recommended. The application is directed to smart phone users. It does not have a desktop version. Internet connection is needed in order to run the application in the browser, which means that it does not operate offline. This app is does not provide a front-end part, all of the website is rendered from the server with a code written in Node and EJS. 
## Architecture

The appliction is licenced with MIT license. 

Technologies used: 

* JavaScript and Node
* Express framework
* EJS templating
* Postgres SQL
* Vanilla CSS
* Superagent proxy

Node packages:

* express
* pg
* dotenv
* path
* superagent
* method-override
* ejs

## Tree view

```
book_app (repository)
├──data
│  └── books.sql
├──public
│  └── styles
│      ├── base.css
│      ├── layout.css
│      ├── modules.css
│      └── reset.css
├──views
│  ├── layout
│  │   ├── footer.ejs
│  │   ├── head.ejs
│  │   └── header.ejs
│  └── pages
│      ├── books
│      │   ├── detail.ejs
│      │   ├── edit.ejs
│      │   └── show.ejs
│      ├── searches
│      │   ├── new.ejs
│      │   └── show.ejs
│      ├── error.ejs
│      └── index.ejs
├── .env
├── .eslintrc.json
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```