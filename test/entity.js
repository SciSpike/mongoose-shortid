var mongoose = require('mongoose');
var path = require('path');
var ShortId = require('../');
var extend = require('util')._extend;


// Create the schema
var Schema = mongoose.Schema;
ShortId.prototype.genNum = require('./counters').genNum;
var options = {
    len: 6,
    base: 58,
    retries: 0,
    alphabet: '23456789ABCDEFGHJKLMNPQRTUVWXYZ_',
    counter: "entityName"
};
ShortId.prototype.options = extend(ShortId.prototype, options);

// Definition of the schema
var schema = new Schema({
    _id: {
        type: ShortId
    },
    name: {
        type: String
    },
}, {
    collection: "entityName"
});


// Compile the model
var Entity = mongoose.model('Entity', schema);

// Make the schema available
exports.Entity = Entity;
