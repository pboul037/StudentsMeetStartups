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
            loadModel("meetup", "Meetup"),
            loadModel("student", "Student"),
            loadModel("startup", "Startup"),
            loadModel("useraccount", "UserAccount"),
            loadModel("review", "Review"),
            loadModel("usertype", "UserType"),
            loadAssociations
        ], handleError);

        function loadModel(name, identifier)
        {
            return function (cb) {
                db.load("../models/" + name, function (error) {
                    if (!error)
                    {
                        models[name] = db.models[name];
                        global[identifier] = db.models[name];
                    }
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



