'use strict';

var mongoose = require('mongoose');
var Person = require('../models/person.js');

mongoose.connect('mongodb://localhost/genovesa');

var father = new Person({
  firstname: 'John',
  lastname: 'Doe',
  original_entity_id: new mongoose.Types.ObjectId
});

var mother = new Person({
  firstname: 'Jane',
  lastname: 'Roe',
  original_entity_id: new mongoose.Types.ObjectId
});

var child = new Person({
  firstname: 'James',
  lastname: 'Doe',
  original_entity_id: new mongoose.Types.ObjectId,
  father_id: father._id,
  mother_id: mother._id,
  birth: {
    date: '1887/06/25',
    place: 'Paris (7ème arrondissement)'
  },
  death: {
    date: '1960/08/13',
    place: 'Rennes'
  }
});

father.children_id = [child._id];
mother.children_id = [child._id];

father.save(function (err) {
  if (err) {
    console.log(err);
  }

  mother.save(function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    child.save(function (err) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      else {
        console.log('database filled-up');
        process.exit(0);
      }
    });
  });
});