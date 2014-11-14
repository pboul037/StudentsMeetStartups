/**
 * Define associations between objects
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

module.exports = function () {
    /* 1 Student -- 1 UserAccount */
    Student.hasOne("account", UserAccount, { reverse: "students",
        field: { "accountId": { type: "integer", name: "accountId", mapsTo: "account_id" } } });
    /* 1 Startup -- * UserAccount */
    Startup.hasMany("accounts", UserAccount, {}, { reverse: "startups",
        mergeTable: "startup_accounts", mergeId: "startup_id", mergeAssocId: "useraccount_id" });  

    /* * Meetup -- 1 Startup */
    Meetup.hasOne("startup", Startup, { reverse: "meetups",
        field: { "startupId": { type: "integer", name: "startupId", mapsTo: "startup_id" } } });
    /* * Meetup -- * Student */
    Meetup.hasMany("participants", Student, {}, { reverse: "meetups",
        mergeTable: "meetup_participants", mergeId: "meetup_id", mergeAssocId: "student_id" });

    /* * Review -- 1 Meetup */
    Review.hasOne("meetup", Meetup, { reverse: "reviews" });
    /* 1 Startup -- * Review */
    Startup.hasMany("reviews", Review, {}, { reverse: "startups" });
    /* 1 Student -- * Review */
    Student.hasMany("reviews", Review, {}, { reverse: "students" });

    /* * UserAccount -- 1 UserType */
    UserAccount.hasOne("type", UserType, { autoFetch: true,
        field: { "typeId": { type: "integer", name: "typeId", mapsTo: "type_id" } } });
    /* * Review -- 1 UserType */
    Review.hasOne("revieweeType", UserType, { autoFetch: true,
        field: { "revieweeTypeId": { type: "integer", "name": "revieweeTypeId", mapsTo: "revieweetype_id" } } });       
};


