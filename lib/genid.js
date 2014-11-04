var bignum = require('bignum');
var crypto = require('crypto');

/*
 * Default encoding alphabets
 * URL-friendly base-64 encoding is chosen.  Base-32 is best suited
 * for tiny-URL like applications, because I and 1 can't be confused
 * and the upper-case characters are more easily remembered by a human.
 *
 * Where "native", we use the bignum native encoding routine.
 */
var defaultAlphabets = {
    10: "native",
    16: "native",
    32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    36: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    62: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
};
var self = this;

// Convert the bignum to a string with the given base
this.bignumToString = function(bignum, alphabet) {
    var base = alphabet.length;
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

this.genNum = function (alphabet, cb) {
    // Generate a random byte string of the required length
    var that = this;

    var bytes = Math.floor( this.len * Math.log(alphabet.length) / Math.log(256));
    crypto.pseudoRandomBytes(bytes, function(err, buf) {

        // Propagate errors...
        if (err) {
            cb(err, null);
            return;
        }

        // Convert to the required base
        var num = bignum.fromBuffer(buf);
        var id = self.bignumToString(num, alphabet);

        // Prefix with the first char to reach the desired fixed length string
        id = Array(that.len - id.length + 1).join(alphabet[0]) + id;

        cb(null, id);
    });
};

this.genId = function(options, cb) {
    // if an alphabet was specified it takes priorty
    // otherwise use the default alphabet for the given base
    var base = this.alphabet ? this.alphabet.length : this.base;
    var alphabet = this.alphabet || defaultAlphabets[base];

    if (!alphabet) {
        var err = new Error(
            "Only base " +
            Object.keys(alphabets).join(", ") +
            " supported if an alphabet is not provided."
        );
        cb(err, null);
        return;
    }

    this.genNum(alphabet, cb);
};

module.exports = exports = {genNum: this.genNum, genId: this.genId, bignumToString: this.bignumToString};
