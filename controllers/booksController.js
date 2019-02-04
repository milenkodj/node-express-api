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

  return { get, post };
}

module.exports = booksController;
