
modules.exports = function (db) {
    var Meetup = db.define("user", {
        startTime:          { type: "date", time: true, mapsTo: "start_time" },
        endTime :           { type: "date", time: true, mapsTo: "end_time" },
        numMaxParticipants: { type: "integer", mapsTo: "max_participants" }
    }, {
        collection: "meetups" /* Real table name */
    });
};


