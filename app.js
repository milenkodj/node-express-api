const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

if (process.env.ENV === 'test') {
  console.log('This is test');
  mongoose.connect('mongodb://172.26.146.59/bookAPI-test');
} else {
  mongoose.connect('mongodb://172.26.146.59/bookAPI');
}

const Book = require('./models/bookModel');
const booksRouter = require('./routers/booksRouter')(Book);

const port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', booksRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my Nodeom API');
});

app.server = app.listen(port, () => {
  console.log(`running on port ${port}`);
});

module.exports = app;
