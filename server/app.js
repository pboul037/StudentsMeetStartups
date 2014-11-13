/*
 * Server main bootstrap
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

var express = require("express"),
    async = require("async"),
    bodyParser = require("body-parser"),
    _ = require("lodash"),
    database = require("./lib/database"),
    responseHandler = require("./lib/response-handler"),
    config  = require("./config");

/* Load the configuration specific to the environment */
config = config[process.env.NODE_ENV];

/* Configure the framework */
var app = express();
app.enable("trust proxy");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(database.connection(config.dataSourceName));
app.use(responseHandler);

/* Define the routes */
app.get("/", function (request, response) {
    response.sendFile("index.html", {root: "../client/"});
});

app.get('/startups', function (request, response) {
    var Startup = request.models.startup;
    response.put(Startup.find.bind(Startup));
});

app.get('/startup/:id', function (request, response) {
    var Startup = request.models.startup;
    response.put(Startup.get.bind(Startup, request.params.id));
});

app.post('/startup', function (request, response) {
    var UserType = request.models.usertype;
    var UserAccount = request.models.useraccount;
    var Startup = request.models.startup;

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
    ], response.handle);

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

app.put('/startup/:id', function (request, response) {
    var Startup = request.models.startup;

    async.waterfall([
        Startup.get.bind(Startup, request.params.id),
        function (startup, callback) {
            _.extend(startup, request.body.startup);
            startup.save(callback);
        }
    ], response.handle);
});

app.get('/students', function (request, response) {
    var Student = request.models.student;
    response.put(Student.find.bind(Student));
});

app.get('/student/:id', function (request, response) {
    var Student = request.models.student;
    response.put(Student.get.bind(Student, request.params.id));
});

app.post('/student', function (request, response) {
    var UserType = request.models.usertype;
    var UserAccount = request.models.useraccount;
    var Student = request.models.student;

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
        }
    ], response.handle);
});

app.put('/student/:id', function (request, response) {
    var Student = request.models.student;

    async.waterfall([
        Student.get.bind(Student, request.params.id),
        function (student, callback) {
            _.extend(student, request.body.student);
            student.save(callback);
        }
    ], response.handle);
});

app.post("/meetup", function (request, response) {
    var Meetup = request.models.meetup;
    response.put(Meetup.create.bind(Meetup, request.body.meetup));
});

app.post("/meetup/participant", function (request, response) {
    var Meetup = request.models.meetup;
    var Student = request.models.student;

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
    ], response.handle);
});

/* Start listening for connections */
var server = app.listen(config.listenPort, function () {
    console.log('Listening on port %d', server.address().port);
});


