/*
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

define(function (require) {
    var http = require('plugins/http'),
        moment = require('moment');

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
        return http.get('/meetups', { 'startupId': startupId, 'upcoming': 'true' }).then(function (response) {
            var meetups = response.meetups;

            $.each(meetups, function (key, meetup) {
                meetups[key] = $.extend(new Meetup, meetup);
            });

            return meetups;
        });
    };
    
    Meetup.findByStudent = function (studentId) {
        return http.get('/meetups', { 'studentId': studentId, 'upcoming': 'true' }).then(function (response) {
            var meetups = response.meetups;

            $.each(meetups, function (key, meetup) {
                meetups[key] = $.extend(new Meetup, meetup);
            });

            return meetups;
        });
    };

    Meetup.prototype.save = function () {
        if (this.id == null)
            return http.post('/meetup', { 'meetup': this });
        else
            return http.put('/meetup', { 'meetup': this });
    };

    Meetup.prototype.addParticipant = function (studentId) {
        return http.post("/meetup/participant", { "meetupId": this.id, "studentId": studentId });
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

