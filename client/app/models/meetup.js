
define(function (require) {
    var http = require('plugins/http');
    var apiUrl = 'http://192.168.56.101/meetup';

    function Meetup(startupId)
    {
        this.id = null;
        this.startupId = startupId;
        this.startTime = '';
        this.endTime = '';
        this.numMaxParticipants = 5;
        this.location = '';
    }

    Meetup.prototype.save = function () {
        if (this.id == null)
            return http.post(apiUrl, { 'meetup': this });
        else
            return http.put(apiUrl, { 'meetup': this });
    };

    return Meetup;
});

