
define(function (require) {
    var http = require('plugins/http'),
        moment = require('moment');

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
    
    Meetup.findByStartup = function (startupId) {
        return http.get(apiUrl + 's', { 'startupId': startupId, 'upcoming': 'true' }).then(function (response) {
            var meetups = response.meetups;

            $.each(meetups, function (key, meetup) {
                meetups[key] = $.extend(new Meetup, meetup);
            });


            return meetups;
        });
    };
    
    Meetup.findByStudent = function (studentId) {
        return http.get(apiUrl + 's', { 'studentId': studentId, 'upcoming': 'true' }).then(function (response) {
            var meetups = response.meetups;

            $.each(meetups, function (key, meetup) {
                meetups[key] = $.extend(new Meetup, meetup);
            });

            return meetups;
        });
    };

    Meetup.prototype.save = function () {
        if (this.id == null)
            return http.post(apiUrl, { 'meetup': this });
        else
            return http.put(apiUrl, { 'meetup': this });
    };
    
    Meetup.prototype.getDuration = function (format) {
        var durationSeconds = moment(this.endTime).unix() - moment(this.startTime).unix();
        return moment.duration(durationSeconds, 'seconds').humanize();
    };

    Meetup.prototype.formatStartTime = function () {
        return moment(this.startTime).format("dddd, MMMM Do, h:mm a");
    };

    return Meetup;
});

