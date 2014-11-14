
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
            getStudent: function (callback) {
                this.getStudents(function (error, students) {
                    callback(error, students[0]);
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
            },
            validPassword: function (password) {
                return (this.password == password);
            }
        }
    });

    return cb();
};



