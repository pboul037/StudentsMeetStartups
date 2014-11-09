
module.exports = function (db, cb) {
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
            },
            isStudentAccount: function (callback) {
                this.getType(function (error, type) {
                    callback(error, type.name == 'student');
                });
            },
            isStartupAccount: function (callback) {
                this.getType(function (error, type) {
                    callback(error, type.name == 'startup');
                });
            }
        }
    });

    return cb();
};



