var mongoose = require('mongoose');
var ShortId = require('../lib/shortid');
var genid = require('../lib/genid');
var extend = require('util')._extend;
var bignum = require('bignum');

// Create the schema
var Schema = mongoose.Schema;

// Definition of the schema
/**
 * The counters schema holds an incremental counter for each table. It's used by
 * the shortID identifiers to control the uniqueness and keep the id as readable
 * as feasible.
 */
var schema = new Schema({
    // The identifier counter.
    _id: String,
    // The next value of each counter.
    next: {
        type: Number,
        "default": 1
    }
}, {
    collection: "counters"
});

// Compile the model
var Counter = mongoose.model('Counter', schema);
var that = extend(this, genid);

var genNum = function(options, callback) {
    var counter = options.parent || 'countersCollection';
    return Counter.findByIdAndUpdate(counter, {
        $inc: {
            next: 1
        }
    }, {
        "new": true,
        upsert: true,
        select: {
            next: 1
        }
    }, function(err, result) {
        var big = bignum(result.next);
        callback(err, big);
    });
};

module.exports = exports = {
    genNum: genNum
};