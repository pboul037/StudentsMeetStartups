/**
 * Defines a review and its properties, and to what database column they correspond.
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

module.exports = function (db, cb) {
    var Review = db.define("review", {
        comment:         { type: "text", size: 140 },
        rating:          { type: "integer" },
        hired:           { type: "boolean" },
    }, {
        collection: "reviews", /* Real table name */    
        methods: {
            getStartup: function (callback) {
                this.getStartups(function (error, startups) {
                    callback(error, startups[0]);
                });
            },
            getStudent: function (callback) {
                this.getStudents(function (error, students) {
                    callback(error, students[0]);
                });
            },
            isStudentReview: function (callback) {
                this.getRevieweeType(function (error, type) {
                    callback(error, type.name == 'student');   
                });
            },
            isStartupReview: function () {
                this.getRevieweeType(function (error, type) {
                    callback(error, type.name == 'startup');   
                });
            },
        }
    });

    return cb();
};



