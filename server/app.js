
var express = require('express'),
    orm     = require('orm'),
    app     = express(),
    config  = require('./config');

/* Load the configuration specific to the environment */
config = config[process.env.NODE_ENV];

/* Trust our Apache reverse proxy */
app.enable('trust proxy');

/* Wrap node-orm2 in Express middleware */
app.use(orm.express(config.dataSourceName, {
    define: function (db, models, next) {
        /* Load models */
        db.load('./models/meetup');
        db.load('./models/student');
        db.load('./models/startup');
        db.load('./models/useraccount');
        models = db.models;

        /* Define assocations */
        var associations = require('./models/associations');
        associations();

        next();
    }
}));
    
function handleError(error, data, callback)
{
    if (error)
        this.response.json({success: false, message: error.message});
    else
        callback(data);
}

/* Fetch startups */
app.get('/startups', function (request, response) {
});

/* Fetch a specific startup */
app.get('/startup/:id', function (request, response) {
    var Startup = request.models.startup;
    var getStartup = _.bind(Startup.get, Startup);
    var handleError = _.bind(handleError, {response: response, request: request});

    async.seq(
        getStartup,
        handleError,
        function (startup) {
            response.json({success: true, data: startup});
        }
    )(request.params.id);
});

/* Create new startup */
app.post('/startup', function (request, response) {

});

/* Update existing startup */
app.put('/startup/:id', function (request, response) {

});

/* Create new student */
app.post('/student', function (request, response) {

});

/* Fetch a specific student */
app.get('/student/:id', function (request, response) {
    var Student = request.models.student;
    var getStudent = _.bind(Student.get, Startup);
    var handleError = _.bind(handleError, {response: response, request: request});

    async.seq(
        getStudent,
        handleError,
        function (student) {
            response.json({success: true, data: student});
        }
    )(request.params.id);
});

/* Create new meetup */
app.post("/meetup", function (request, response) {

});

/* Update existing meetup */
app.put("/meetup/:id", function (request, response) {

});

var server = app.listen(config.listenPort, function () {
    console.log('Listening on port %d', server.address().port);
});


