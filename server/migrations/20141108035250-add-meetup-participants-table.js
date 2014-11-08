var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("meetup_participants", {
        meetup_id: { type: "int", notNull: true },
        student_id: { type: "int", notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("meetup_participants", callback);
};
