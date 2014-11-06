var mongoose = require('mongoose');
var path = require('path');
var ShortId = require('../');

// Create the schema
var Schema = mongoose.Schema;

// Definition of the schema
var schema = new Schema({
    _id: {
        type: ShortId
    },
    name: {
        type: String
    },
    other: {
        type: ShortId,
        required: true
    }
}, {
    collection: "originalEntityName"
});


// Compile the model
var Entity = mongoose.model('OriginalEntity', schema);

// Make the schema available
exports.Entity = Entity;