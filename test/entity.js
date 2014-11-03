var mongoose = require('mongoose');
var path = require('path');
var ShortId = require('../');

// Create the schema
var Schema = mongoose.Schema;
ShortId.prototype.generator = require('../lib/counters');
ShortId.prototype.generatorOptions = {len: 6, base: 58, retries: 0, alphabet: '23456789ABCDEFGHJKLMNPQRTUVWXYZ_', table:"entityName"};

// Definition of the schema
var schema = new Schema( {
  _id: {type: ShortId},
  name: { type: String},
},{collection:"entityName"});


// Compile the model
var Entity = mongoose.model('Entity', schema);

// Make the schema available
exports.Entity = Entity;
