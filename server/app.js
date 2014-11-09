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
app.get('/startups', function (request, response) {
    var Startup = request.models.startup;
    response.put(Startup.find.bind(Startup));
});

app.get('/startup/:id', function (request, response) {
    var Startup = request.models.startup;
    response.put(Startup.get.bind(Startup, request.params.id));
});

app.post('/startup', function (request, response) {
    var Startup = request.models.startup;
    response.put(Startup.create.bind(Startup, request.body.startup));
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
    var Student = request.models.student;
    response.put(Student.create.bind(Student, request.body.student));
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
        function (callback) {
            async.parallel([
                Student.get.bind(Student, request.body.student_id),
                Meetup.get.bind(Meetup, request.body.meetup_id)
            ], callback);
        },
        function (results, callback) {
            var student = results[0],
                meetup = results[1];

            meetup.addParticipant(student, callback);
        }
    ], response.handle);
});

/* Start listening for connections */
var server = app.listen(config.listenPort, function () {
    console.log('Listening on port %d', server.address().port);
});


