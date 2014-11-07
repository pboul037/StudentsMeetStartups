
modules.exports = function (db) {
    var Meetup = db.define('user', {
        startTime: { type: "date", time: true },
        endTime : { type: "date", time: true },
        numMaxParticipants: { type: "integer" }
    });
});


