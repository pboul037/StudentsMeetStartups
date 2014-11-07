
modules.exports = function (db) {
    var Student = db.define('student', {
        name: String,
        emailAddress: { type: "text", mapsTo: "email_address" },
        phoneNumber: { type: "text", size: 10, mapsTo: "phone_number" },
        selfDescription: { type: "text", mapsTo: "self_description" },
        resume: { type: "binary" },
        transcript: { type: "binary" }
    });
};



