
module.exports = function (db) {
    var Student = db.models.student;
    var Startup = db.models.startup;
    var UserAccount = db.models.useraccount;
    var Meetup = db.models.meetup;

    Student.hasOne('account', UserAccount, { reverse: "student" });
    Startup.hasMany('accounts', UserAccount, { reverse: "startup" });

    Meetup.hasOne('startup', Startup, { reverse: "meetups" });
    Meetup.hasMany('students', Student, { reverse: "meetups" });
};


