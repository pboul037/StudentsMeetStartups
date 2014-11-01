
var express = require('express'),
    orm     = require('orm'),
    app     = express(),
    config  = require('./config');

/* List and filter startups */
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


