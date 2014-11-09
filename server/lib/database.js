/*
 * Database configuration and definitions
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

var async = require("async"),
    orm = require("orm");

module.exports.connection = function (dataSourceName)
{
    return orm.express(dataSourceName, { define: function (db, models, next) {
        async.series([
            loadModel("meetup"),
            loadModel("student"),
            loadModel("startup"),
            loadModel("useraccount"),
            loadModel("review"),
            loadModel("usertype"),
            loadAssociations
        ], handleError);

        function loadModel(name)
        {
            return function (cb) {
                db.load("../models/" + name, function (error) {
                    if (!error)
                        models[name] = db.models[name];
                    cb(error);
                });
            };
        }

        function loadAssociations(cb)
        {
            var associations = require("../models/associations");
            associations(db);
            cb(null);
        }

        function handleError(error)
        {  
            if (error)
                console.log(error);
            else
                next();
        }
    }});
};



