var mongoose = require('mongoose');
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
    _id : String,
    // The next value of each counter.
    next : {
        type : Number,
        "default" : 1
    }
}, {
    collection : "counters"
});

// Compile the model
var Counter = mongoose.model('Counter', schema);

// Make the schema available
module.exports = exports = function() {
    // Convert the bignum to a string with the given base
    function bignumToString(bignum, base, alphabet) {
        // Prefer native conversion
        if (alphabet === "native" && base != 6) {
            return bignum.toString(base);
        }

        // Old-sk00l conversion
        var result = [];

        while (bignum.gt(0)) {
            var ord = bignum.mod(base);
            result.push(alphabet.charAt(ord));
            bignum = bignum.div(base);
        }

        return result.reverse().join("");
    }

    return function(options, cb) {
        var len = options.len || 6;
        // if an alphabet was specified it takes priorty
        // otherwise use the default alphabet for the given base
        var base = options.alphabet ? options.alphabet.length
                : (options.base || 58);
        var alphabet = options.alphabet || '23456789ABCDEFGHJKLMNPQRTUVWXYZ_';
        var counter = options.table || 'countersCollection';

        if (!alphabet) {
            var err = new Error("Only base "
                    + Object.keys(alphabets).join(", ")
                    + " supported if an alphabet is not provided.");
            cb(err, null);
            return;
        }

        // Generate a random byte string of the required length
        var bytes = Math.floor(len * Math.log(base) / Math.log(256));
        var increment = function(counter, callback) {
            return Counter.findByIdAndUpdate(counter, {
                $inc : {
                    next : 1
                }
            }, {
                "new" : true,
                upsert : true,
                select : {
                    next : 1
                }
            }, function(err, result) {
                callback(err, result.next);
            });
        };
        
        increment(counter, cb);
    };
}();
