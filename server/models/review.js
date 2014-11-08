
modules.exports = function (db) {
    var Review = db.define("review", {
        comment:         { type: "text", size: 140 },
        rating:          { type: "integer" },
        hired:           { type: "boolean" },
        wroteAbout:      { type: "enum", values: ["student", "startup"], mapsTo: "wrote_about" }
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
            }
        }
    });
};



