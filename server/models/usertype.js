
module.exports = function (db, cb) {
    var UserType = db.define("usertype", {
        name: { type: "text" }
    }, {
        collection: "usertypes" /* Real table name */   
    });

    return cb();
};


