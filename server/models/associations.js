
module.exports = function (db) {
    var Student = db.models.student;
    var Startup = db.models.startup;
    var UserAccount = db.models.useraccount;
    var UserType = db.models.usertype;
    var Meetup = db.models.meetup;
    var Review = db.models.review;

    Student.hasOne("account", UserAccount, { reverse: "student" });     /* 1 -- 1 */
    Startup.hasMany("accounts", UserAccount, { reverse: "startups" });  /* 1 -- * */

    Meetup.hasOne("startup", Startup, { reverse: "meetups" });          /* * -- 1 */
    Meetup.hasMany("participants", Student, { reverse: "meetups" });    /* * -- * */

    Review.hasOne("meetup", Meetup, { reverse: "reviews" });            /* * -- 1 */
    Startup.hasMany("reviews", Review, { reverse: "startups" });        /* 1 -- * */
    Student.hasMany("reviews", Review, { reverse: "students" });        /* 1 -- * */

    UserAccount.hasOne("type", UserType, { autoFetch: true });          /* 1 -- 1 */
    Review.hasOne("revieweeType", UserType, { autoFetch: true,          /* 1 -- 1 */
        field: "revieweetype_id" });       
};


