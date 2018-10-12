'use strict';
const express = require('express');
const simDB = require('../db/simDB');  // <<== add this
const data = require('../db/notes');
const notes = simDB.initialize(data); // <<== and this

const router = express.Router();

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  notes.update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  console.log('api/notes' + searchTerm);
  notes.filter(searchTerm)
    .then(list => {
      res.json(list);
    })
    .catch(err => next(err));
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  notes.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) =>{
  const {id} = req.params;
  console.log(id);
  notes.delete(id)
    .then(item => {
      console.log(item);
      if (item) {
        res.sendStatus(204);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;