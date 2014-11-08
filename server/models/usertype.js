
modules.exports = function (db) {
    var UserType = db.define("usertype", {
        name: { type: "text" }
    }, {
        collection: "usertypes" /* Real table name */   
    });
};


