function booksController(Book) {
  function post(req, res) {
    const book = new Book(req.body);
    if (!req.body.title) {
      res.status(400);
      res.send('Title is required.');
    }
    book.save();
    res.status(201);
    return res.json(book);
  }

  function get(req, res) {
    // const { query } = req;
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      const hyperBooks = books.map((book) => {
        const hyperBook = book.toJSON();
        hyperBook.links = {};
        hyperBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
        return hyperBook;
      });
      return res.json(hyperBooks);
    });
  }

  function find(req, res) {
    const hyperBook = req.book.toJSON();
    hyperBook.links = {};
    hyperBook.links.filterByThisGenre = `http://${req.headers.host}/api/books?genre=${encodeURIComponent(hyperBook.genre)}`;
    return res.json(hyperBook);
  }

  function put(req, res) {
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
  }

  function patch(req, res) {
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
  }

  function remove(req, res) {
    req.book.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  }

  return {
    get, post, find, put, patch, remove
  };
}

module.exports = booksController;
