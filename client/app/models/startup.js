/*
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

define(function (require) {
    var http = require('plugins/http'),
        Meetup = require('models/meetup');

    function Startup()
    {
        this.id = null;
        this.companyName = '';
        this.emailAddress = '';
        this.description = '';
        this.postalAddress = '';
    }

    Startup.get = function (id) {
        return http.get('/startup/' + id).then(function (response) {
            return $.extend(new Startup, response.startup); 
        });
    };

    Startup.findAll = function () {
        return http.get('/startups', { 'joinUpcomingMeetups': 'true' }).then(function (response) {
            var startups = response.startups;

            $.each(startups, function (key, startup) {
                startups[key] = $.extend(new Startup, startup);

                if (!startups[key].hasOwnProperty('meetups'))
                    startups[key].meetups = [];

                $.each(startups[key].meetups, function (meetupkey, meetup) {
                    startups[key].meetups[meetupkey] = $.extend(new Meetup, meetup);
                });
            });

            return startups;
        });
    };

    Startup.prototype.save = function () {
        if (this.id == null)
            return http.post('/startup', { 'startup': this });
        else
            return http.put('/startup/' + this.id, { 'startup': this });
    };

    return Startup;
});

