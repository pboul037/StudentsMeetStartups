var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("reviews", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        comment: { type: "string", length: 140 },
        rating: { type: "int" },
        hired: { type: "int", length: 1 },
        wrote_about: { type: "string" },
        meetup_id: { type: "int", notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("reviews", callback);
};
