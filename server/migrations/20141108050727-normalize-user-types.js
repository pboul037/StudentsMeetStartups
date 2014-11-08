var dbm = require("db-migrate");
var async = require("async");
var type = dbm.dataType;

exports.up = function(db, callback) {
    async.series([
        db.createTable.bind(db, "usertypes", {
            id: { type: "int", primaryKey: true, autoIncrement: true },
            name: { type: "string" }
        }),
        db.insert.bind(db, "usertypes", ["id", "name"], [1, "student"]),
        db.insert.bind(db, "usertypes", ["id", "name"], [2, "startup"]),
        db.addColumn.bind(db, "useraccounts", "type_id", { type: "int", notNull: true }),
        db.removeColumn.bind(db, "reviews", "wrote_about"),
        db.addColumn.bind(db, "reviews", "revieweetype_id", { type: "int", notNull: true })
    ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.removeColumn.bind(db, "reviews", "revieweetype_id"),
        db.addColumn.bind(db, "reviews", "wrote_about", { type: "string" }),
        db.removeColumn.bind(db, "useraccounts", "type_id"),
        db.dropTable.bind(db, "usertypes")
    ], callback);
};
