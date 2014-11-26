/**
 * Authentication handling using the passport library. Fetches the user account
 * from the database and checks the password.
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

var PassportLocalStrategy = require("passport-local").Strategy;

module.exports.initialize = function (passport)
{
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserAccount.get(id, function (error, user) {
            done(error, user);
        });
    });

    return new PassportLocalStrategy(function (username, password, done) {
        UserAccount.one({ "username": username }, function (error, userAccount) {
            if (error)
                return done(error);
            else if (!userAccount)
                return done(null, false, { message: "Incorrect username" });
            else if (!userAccount.validPassword(password))
                return done(null, false, { message: "Incorrect password." });
            else
                return done(null, userAccount);
        });
    });
};

