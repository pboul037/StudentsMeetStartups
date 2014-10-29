
var express = require('express'),
    orm     = require('orm'),
    app     = express(),
    config  = require('./config');

var server = app.listen(config.listenPort, function () {
    console.log('Listening on port %d', server.address().port);
});


