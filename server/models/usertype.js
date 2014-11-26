/**
 * Defines a user type and its properties, and to what database column they correspond.
 *
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


