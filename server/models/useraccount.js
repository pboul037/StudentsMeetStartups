
modules.exports = function (db) {
    var UserAccount = db.define("useraccounts", {
        username: String,
        password: String,
        belongsTo: { type: "enum", values: ["student", "startup"] }
    }, {
        collection: "useraccounts", /* Real table name */   
        methods: {
            getStartup: function (callback) {
                this.getStartups(function (error, startups) {
                    callback(error, startups[0]);
                });
            }
        }
    });
};



