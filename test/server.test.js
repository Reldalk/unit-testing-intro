'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('GET handler', function () {
  it('should list items on GET', function() {
    return chai
      .request(app)
      .get('/api/notes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');

        expect(res.body.length).to.be.equal(10);

        const expectedKeys = ['id', 'title', 'content'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  it('should return not found', function() {
    return chai
      .request(app)
      .get('/api/note')
      .then(function(res) {
        expect(res.body.message).to.be.equal('Not Found');
      });
  });
});

describe('GET id handler', function () {
  it('should list items on GET', function() {
    return chai
      .request(app)
      .get('/api/notes')
      .then(function(res) {
        return chai.request(app).get(`/api/notes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res.body.id).to.be.equal(1000);
        expect(res.body.title).to.be.equal('5 life lessons learned from cats');
        expect(res.body.content).to.be.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
        expect(res).to.have.status(200);
      });
  });

  it('should list items on GET', function() {
    return chai
      .request(app)
      .get('/api/notes/2000')
      .then(function(res) {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equal('Not Found');
      });
  });
});


describe('POST handler', function () {
  it('should add an item on POST', function() {
    const newItem = { title: 'coffee', content: 'I NEED IT' };
    return chai
      .request(app)
      .post('/api/notes')
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('title', 'content', 'id');
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(
          Object.assign(newItem, { id: res.body.id })
        );
      });
  });

  it('should return missing title on POST', function() {
    const newItem = { title: '', content: 'I NEED IT' };
    return chai
      .request(app)
      .post('/api/notes')
      .send(newItem)
      .then(function(res) {
        expect(res.body.message).to.be.equal('Missing `title` in request body');
        expect(res).to.have.status(400);
      });
  });
});


describe('PUT handler', function () {
  it('should overwrite object on PUT', function() {

    const updateData = {
      title: 'foo',
      content: 'bar'
    };

    return (
      chai
        .request(app)
        .get('/api/notes')
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai
            .request(app)
            .put(`/api/notes/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(
            Object.assign(updateData, { id: res.body.id })
          );
        })
    );
  });

  it('it should return 404 on invalid id', function() {
    return (
      chai
        .request(app)
        .get('/api/notes/DOESNOTEXIST')
        .then(function(res) {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('Not Found');
        })
    );
  });

  it('it should return title cannot be empty', function() {

    const updateData = {
      title: '',
      content: 'bar'
    };

    return (
      chai
        .request(app)
        .get('/api/notes')
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai
            .request(app)
            .put(`/api/notes/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Missing `title` in request body')
        })
    );
  });
});

describe('DELETE handler', function () {
  it('should delete items on DELETE', function() {
    return (
      chai
        .request(app)
        .get('/api/notes')
        .then(function(res) {
          return chai.request(app).delete(`/api/notes/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });
});