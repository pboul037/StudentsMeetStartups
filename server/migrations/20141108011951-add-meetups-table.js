var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("meetups", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        start_time: { type: "datetime", notNull: true },
        end_time : { type: "datetime" },
        max_participants : { type: "int" },
        startup_id: { type: "int", notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("meetups", callback);
};
