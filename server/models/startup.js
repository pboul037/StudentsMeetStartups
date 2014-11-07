
modules.exports = function (db) {
    var Startup = db.define('startup', {
        companyName: String,
        emailAdddress: String,
        description: String,
        websiteUrl: String
    });
});



