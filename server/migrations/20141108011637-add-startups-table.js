var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("startups", {
        id: { type: "int", primaryKey: true, autoIncrement: true },
        company_name: { type: "string" },
        email_address : { type: "string", length: 255 },
        description : { type: "text" },
        postalAddress: { type: "text" },
        website_url : { type: "string", length: 255 }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("startups", callback);
};
