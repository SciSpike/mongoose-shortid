var mongoose = require('mongoose');
var genId = require('./genid');
var extend = require('util')._extend;

var Schema = mongoose.Schema,
    Types = mongoose.Types,
    SchemaString = mongoose.Schema.Types.String;

extend(ShortId.prototype, genId);
ShortId.prototype.retries = 4;
ShortId.prototype.base = 64;
ShortId.prototype.len = 7;

function ShortId(key, options) {
    extend(this, options);
    if (options) {
        delete options.required;
        extend(this, options.generatorOptions);
        delete options.generator;
    }

    SchemaString.call(this, key, options);
}

ShortId.prototype.__proto__ = SchemaString.prototype;

Schema.Types.ShortId = ShortId;
Types.ShortId = String;

module.exports = exports = ShortId;