/* eslint-disable no-param-reassign */
const express = require('express');
const booksController = require('../controllers/booksController');

module.exports = (Book) => {
  const booksRouter = express.Router();
  const controller = booksController(Book);

  booksRouter.route('/books')
    .post(controller.post)
    .get(controller.get);

  booksRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });
  booksRouter.route('/books/:bookId')
    .get((req, res) => {
      const hyperBook = req.book.toJSON();
      hyperBook.links = {};
      hyperBook.links.filterByThisGenre = `http://${req.headers.host}/api/books?genre=${encodeURIComponent(hyperBook.genre)}`;
      return res.json(hyperBook);
    })
    .put((req, res) => {
      const { book } = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .patch((req, res) => {
      const { book } = req;
      /* eslint-disable no-underscore-dangle */
      if (req.body._id) {
        delete req.body._id;
      }
      /* eslint-disable no-underscore-dangle */
      Object.entries(req.body).forEach((element) => {
        const key = element[0];
        const value = element[1];
        book[key] = value;
      });
      book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });
  return booksRouter;
};
