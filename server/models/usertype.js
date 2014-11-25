/**
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

module.exports = function (db, cb) {
    var UserType = db.define("usertype", {
        name: { type: "text" }
    }, {
        collection: "usertypes" /* Real table name */   
    });

    return cb();
};


