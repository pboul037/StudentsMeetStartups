
var orm = require("orm"),
    moment = require("moment");

module.exports = function (db, cb) {
    var Student = db.define("student", {
        name:            { type: "text", size: 100 },
        emailAddress:    { type: "text", mapsTo: "email_address" },
        phoneNumber:     { type: "text", size: 10, mapsTo: "phone_number" },
        selfDescription: { type: "text", mapsTo: "self_description" },
        resume:          { type: "binary" },
        transcript:      { type: "binary" }
    }, {
        collection: "students", /* Real table name */    
        methods: {
            getUpcomingMeetups: function (callback) {
                this.getMeetups({ "startTime": orm.gt(moment().format("YYYY-MM-DD HH:MM:SS")) }, callback); 
            }
        }
    });

    return cb();
};



