
modules.exports = function (db) {
    var Startup = db.define('startup', {
        companyName: { type: "text", mapsTo: "company_name" },
        emailAddress: { type: "text", mapsTo: "email_address" },
        description: { type: "text" },
        websiteUrl: { type: "text", mapsTo: "website_url" }
    });
};



