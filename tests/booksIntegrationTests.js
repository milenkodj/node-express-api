require('should');
const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'test';

const app = require('../app');

const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('Book crud test', () => {
  it('should allow a book to be posted and return read and _id', (done) => {
    const book = { title: 'test book', author: 'me', genre: 'fiction' };

    agent.post('/api/books')
      .send(book)
      .expect(200)
      .end((err, res) => {
        // console.log(res);
        res.body.read.should.equal(false);
        res.body.should.have.property('_id');
        done();
      });
  });

  afterEach((done) => {
    Book.deleteMany({ }).exec();
    done();
  });

  after((done) => {
    mongoose.connection.close();
    app.server.close(done);
  });
});
