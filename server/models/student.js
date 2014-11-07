
modules.exports = function (db) {
    var Student = db.define('student', {
        name: String,
        emailAdddress: String,
        phoneNumber: { type: "text", size: 10 },
        selfDescription: { type: "text" },
        resume: { type: "binary" },
        transcript: { type: "binary" }
    });
});



