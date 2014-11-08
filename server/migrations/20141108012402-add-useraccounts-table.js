var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("useraccounts", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        username: { type: "string" },
        password : { type: "string" }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("useraccounts", callback);
};
