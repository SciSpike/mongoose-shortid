var mongoose = require('mongoose');
var ShortId = require('./shortid');

var defaultSave = mongoose.Model.prototype.save;
mongoose.Model.prototype.save = function(cb) {
  for (fieldName in this.schema.tree) {
    if (this.isNew && this[fieldName] === undefined) {
        var idType = this.schema.tree[fieldName];

        if (idType === ShortId || idType.type === ShortId) {
            var shortIdInstance = new ShortId(idType);
            var retries = shortIdInstance.retries;
            var self = this;
            function attemptSave() {
              shortIdInstance.generator(null, function(err, id) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    self[fieldName] = id;
                    defaultSave.call(self, function(err, obj) {
                        if (err &&
                            err.code == 11000 &&
                            err.err.indexOf(fieldName) !== -1 &&
                            retries > 0
                        ) {
                            --retries;
                            attemptSave();
                        } else {
                            // TODO check these args
                            cb(err, obj);
                        }
                    });
                });
            }
            attemptSave();
            return;
        }
    }
  }
  defaultSave.call(this, cb);
};

module.exports = exports = ShortId;
