
modules.exports = function (db) {
    var UserAccount = db.define('useraccount', {
        username: String,
        password: String
    });
});



