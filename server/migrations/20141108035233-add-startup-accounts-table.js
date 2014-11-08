var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("startup_accounts", {
        startup_id: { type: "int", notNull: true },
        useraccount_id: { type: "int", notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("startup_accounts", callback);
};
