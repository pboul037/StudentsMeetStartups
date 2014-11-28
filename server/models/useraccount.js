/**
 * Defines a user account and its properties, and to what database column they correspond.
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

var _ = require("lodash");

module.exports = function (db, cb) {
    var UserAccount = db.define("useraccount", {
        username: { type: "text" },
        password: { type: "text" }
    }, {
        collection: "useraccounts", /* Real table name */   
        methods: {
            getStartup: function (callback) {
                this.getStartups(function (error, startups) {
                    callback(error, startups[0]);
                });
            },
            getStudent: function (callback) {
                this.getStudents({ omit: ["resume", "transcript"] }, function (error, students) {
                    callback(error, _.omit(students[0], "resume", "transcript"));
                });
            },
            isStudentAccount: function (callback) {
                this.getType(function (error, type) {
                    callback(error, type.name == 'student');
                });
            },
            isStartupAccount: function (callback) {
                this.getType(function (error, type) {
                    callback(error, type.name == 'startup');
                });
            },
            validPassword: function (password) {
                return (this.password == password);
            }
        }
    });

    return cb();
};



