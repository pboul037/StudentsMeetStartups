
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
        var assocations = require('./models/assocations');
        assocations();

        next();
    }
}));

/* Search startups */
app.get('/startups', function ( request, response ) {

});

/* Fetch information about a specific startup */
app.get('/startup/:id', function ( request, response ) {

});

/* Fetch information about a specific student */
app.get('/student/:id', function ( request, response ) {
    request.params.id;
});

/* Create new student */
app.post('/student', function ( request, response ) {

});

/* Create new startup */
app.post('/startup', function ( request, response ) {

});

var server = app.listen(config.listenPort, function () {
    console.log('Listening on port %d', server.address().port);
});


