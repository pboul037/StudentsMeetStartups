
var orm = require("orm"),
    moment = require("moment");

module.exports = function (db, cb) {
    var Startup = db.define("startup", {
        companyName:  { type: "text", mapsTo: "company_name" },
        emailAddress: { type: "text", mapsTo: "email_address" },
        description:  { type: "text" },
        postalAddress:  { type: "text" },
        websiteUrl:   { type: "text", mapsTo: "website_url" }
    }, {
        collection: "startups", /* Real table name */  
        methods: {
            getUpcomingMeetups: function (callback) {
                Meetup.find({ "startupId": this.id, "startTime": orm.gt(moment().format("YYYY-MM-DD HH:MM:SS")) }, callback); 
            }
        }
    });

    return cb();
};



