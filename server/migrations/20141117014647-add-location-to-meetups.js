var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.addColumn("meetups", "location", { type: "string", length: 255 }, callback);
};

exports.down = function(db, callback) {
    db.removeColumn("meetups", "location", callback);
};
