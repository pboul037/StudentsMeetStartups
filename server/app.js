/*
 * Server main bootstrap file. Defines the HTTP routes available to the client-side
 * scripts through AJAX calls.
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

var express = require("express"),
    orm = require("orm"),
    fs = require("fs"),
    multipart = require("connect-multiparty"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    async = require("async"),
    _ = require("lodash"),
    moment = require("moment"),
    passport = require("passport"),
    database = require("./lib/database"),
    authentication = require("./lib/authentication"),
    responseHandler = require("./lib/response-handler"),
    config  = require("./config");

/* Load the configuration specific to the environment */
config = config[process.env.NODE_ENV];

/* Configure the framework */
var app = express();

app.enable("trust proxy");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "iab+<8J57'a_77{0I9kQ-5lT", 
    resave: true,
    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(database.connection(config.dataSourceName, process.env.NODE_ENV));
app.use(responseHandler);

passport.use(authentication.initialize(passport));

/* Define the routes */
app.get("/", function (request, response) {
    response.sendFile("index.html", {root: "../client/"});
});

app.post("/login", passport.authenticate("local"), function (request, response) {
    var userAccount = request.user;

    userAccount.isStudentAccount(function (error, isStudentAccount) {
        if (error)
            response.fail(error);
        else if (isStudentAccount)
            response.put("student", userAccount.getStudent.bind(userAccount));
        else
            response.put("startup", userAccount.getStartup.bind(userAccount));
    });
});

app.get("/startups", function (request, response) {
    var tasks = [Startup.find.bind(Startup)];

    if (_.has(request.query, "joinMeetups") || _.has(request.query, "joinUpcomingMeetups"))
    {
        tasks.push(function (fetchedStartups, callback) {
            var startups = [];
            var startupIndex = {};

            _.each(fetchedStartups, function (startup, key) {
                startupIndex[startup.id] = key;
                startups[key] = _.clone(startup);
            });

            var conditions = { "startupId": _.keys(startupIndex) };

            if (_.has(request.query, "joinUpcomingMeetups"))
                conditions.startTime = orm.gt(moment().format("YYYY-MM-DD HH:MM:SS"));

            Meetup.find(conditions, function (error, meetups) {
                if (error)
                    callback(error);
                else
                {
                    _.each(meetups, function (meetup, key) {
                        if (!_.has(startups[startupIndex[meetup.startupId]], "meetups"))
                            startups[startupIndex[meetup.startupId]].meetups = [];
                            
                        startups[startupIndex[meetup.startupId]].meetups.push(_.clone(meetup));
                    });

                    callback(null, startups);
                }
            });
        });
    }

    async.waterfall(tasks, response.handle("startups"));
});

app.get("/startup/:id", function (request, response) {
    response.put("startup", Startup.get.bind(Startup, request.params.id));
});

app.post("/startup", function (request, response) {
    var startup = _.omit(request.body.startup, "username", "password");
    var userAccount = _.pick(request.body.startup, "username", "password");

    async.waterfall([
        async.series.bind(async, [
            createUserAccount,
            Startup.create.bind(Startup, startup)
        ]),
        function (results, callback) {
            var userAccount = results[0],
                startup = results[1];

            startup.addAccounts(userAccount, function (error) {
                callback(error, startup);   
            });
        }
    ], response.handle("startup"));

    function createUserAccount(callback)
    {
        async.waterfall([
            UserType.one.bind(UserType, {name: "startup"}),
            function (userType, callback) {
                userAccount.typeId = userType.id;
                UserAccount.create(userAccount, callback);
            }
        ], callback);
    }
});

app.put("/startup/:id", function (request, response) {
    async.waterfall([
        Startup.get.bind(Startup, request.params.id),
        function (startup, callback) {
            _.extend(startup, request.body.startup);
            startup.save(callback);
        }
    ], response.handle("startup"));
});

app.get("/students", function (request, response) {
    response.put("students", Student.find.bind(Student));
});

app.get("/student/:id", function (request, response) {
    async.waterfall([
        Student.get.bind(Student, request.params.id),
        function (student, callback) {
            callback(null, _.omit(student, "transcript", "resume", "accountId"));
        }
    ], response.handle("student"));
});

app.post("/student", function (request, response) {
    var student = _.omit(request.body.student, "username", "password");
    var userAccount = _.pick(request.body.student, "username", "password");

    async.waterfall([
        UserType.one.bind(UserType, {name: "student"}),
        function (userType, callback) {
            userAccount.typeId = userType.id;
            UserAccount.create(userAccount, callback);
        },
        function (userAccount, callback) {
            student.accountId = userAccount.id;
            Student.create(student, callback);
        },
        function (student, callback) {
            callback(null, _.omit(student, "resume", "transcript", "accountId"));
        }
    ], response.handle("student"));
});

app.put("/student/:id", function (request, response) {
    async.waterfall([
        Student.get.bind(Student, request.params.id),
        function (student, callback) {
            _.extend(student, request.body.student);
            student.save(callback);
        },
        function (student, callback) {
            callback(null, _.omit(student, "transcript", "resume", "accountId"));
        }
    ], response.handle("student"));
});

app.put("/student/:id/resume", multipart(), uploadStudentDocument("resume"));
app.put("/student/:id/transcript", multipart(), uploadStudentDocument("transcript"));

function uploadStudentDocument(documentName)
{
    return function (request, response) {
        async.waterfall([
            async.series.bind(async, [
                Student.get.bind(Student, request.params.id),
                fs.readFile.bind(fs, request.files['0'].path)
            ]),
            function (results, callback) {
                var student = results[0],
                    fileContents = results[1];

                student[documentName] = fileContents;
                student.save(callback);
            },
            fs.unlink.bind(fs, request.files['0'].path)
        ], response.handle());
    };
}

app.post("/meetup", function (request, response) {
    response.put("meetup", Meetup.create.bind(Meetup, request.body.meetup));
});

app.get("/meetups", function (request, response) {
    if (_.has(request.query, "startupId"))
    {
        async.waterfall([
            Startup.get.bind(Startup, request.query.startupId),
            function (startup, callback) {
                if (_.has(request.query, "upcoming"))
                    startup.getUpcomingMeetups(callback);
                else
                    startup.getMeetups(callback);
            }
        ], response.handle("meetups"));
    }
    else if (_.has(request.query, "studentId"))
    {
        async.waterfall([
            Student.get.bind(Student, request.query.studentId),
            function (student, callback) {
                if (_.has(request.query, "upcoming"))
                    student.getUpcomingMeetups(callback);
                else
                    student.getMeetups(callback);
            }
        ], response.handle("meetups"));
    }
    else
        response.put("meetups", Meetup.find.bind(Meetup));
});

app.post("/meetup/participant", function (request, response) {
    async.waterfall([
        async.series.bind(async, [
            Student.get.bind(Student, request.body.studentId, {only: ["id"]}),
            Meetup.get.bind(Meetup, request.body.meetupId, {only: ["id"]})
        ]),
        function (results, callback) {
            var student = results[0],
                meetup = results[1];

            meetup.addParticipants(student, callback);
        }
    ], response.handle("meetup"));
});

/* Start listening for connections */
var server = app.listen(config.listenPort, function () {
    console.log('Listening on port %d', server.address().port);
});


