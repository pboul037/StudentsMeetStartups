
modules.exports = function (db) {
    var UserAccount = db.define("useraccount", {
        username: { type: "text" },
        password: { type: "text" }
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



