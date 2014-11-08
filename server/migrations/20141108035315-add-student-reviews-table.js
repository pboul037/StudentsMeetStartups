var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("student_reviews", {
        student_id: { type: "int", notNull: true },
        review_id: { type: "int", notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("student_reviews", callback);
};
