var dbm = require("db-migrate");
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("students", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        name: { type: "string", length: 100, notNull: true },
        phone_number: { type: "string", length: 10 },
        email_address: { type: "string", length: 255 },
        self_description: { type: "text" },
        resume: { type: "blob" },
        transcript: { type: "blob" },
        account_id: { type: "int", notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("students", callback);
};
