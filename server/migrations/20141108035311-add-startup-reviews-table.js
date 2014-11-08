var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("startup_reviews", {
        startup_id: { type: "int", notNull: true },
        review_id: { type: "int", notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("startup_reviews", callback);
};
