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
    .get(controller.find)
    .put(controller.put)
    .patch(controller.patch)
    .delete(controller.remove);

  return booksRouter;
};
