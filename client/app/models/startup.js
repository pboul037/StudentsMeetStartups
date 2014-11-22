
define(function (require) {
    var http = require('plugins/http'),
        Meetup = require('models/meetup');
    var apiUrl = 'http://192.168.56.101/startup';

    function Startup()
    {
        this.id = null;
        this.companyName = '';
        this.emailAddress = '';
        this.description = '';
        this.postalAddress = '';
        this.meetups = [];
    }

    Startup.get = function (id) {
        return http.get(apiUrl + '/' + id).then(function (response) {
            return $.extend(new Startup, response.startup); 
        });
    };

    Startup.findAll = function () {
        return http.get(apiUrl + 's', { 'joinUpcomingMeetups': 'true' }).then(function (response) {
            var startups = response.startups;

            $.each(startups, function (key, startup) {
                startups[key] = $.extend(new Startup, startup);

                $.each(startups[key].meetups, function (meetupkey, meetup) {
                    startups[key].meetups[meetupkey] = $.extend(new Meetup, meetup);
                });
            });

            return startups;
        });
    };

    Startup.prototype.save = function () {
        if (this.id == null)
            return http.post(apiUrl, { 'startup': this });
        else
            return http.put(apiUrl + '/' + this.id, { 'startup': this });
    };

    return Startup;
});

