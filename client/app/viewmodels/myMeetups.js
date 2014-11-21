
define(function (require) {
    var router = require('plugins/router'),
        ko = require('knockout'),
        session = require('session'),
        Meetup = require('models/meetup'),
        CreateMeetupModal = require('viewmodels/createMeetupModal'),
        http = require('plugins/http');

    function MeetupsViewModel()
    {
        var self = this;
        
        self.createNewMeetup = function () {
            CreateMeetupModal.show();
        };

        self.browse = function () {
            router.navigate('explore');
        };

        self.writeReview = function () {
            /* TODO: TBA, form GUI is done but missing validation and main logic. */
        };
        
        self.meetups = ko.observableArray([]);
        self.isStartup = ko.observable();
        self.isStudent = ko.observable();

        self.activate = function () {
            self.isStartup(session.connectedAsStartup());
            self.isStudent(session.connectedAsStudent());

            if (self.isStartup())
                var findMeetups = Meetup.findByStartup(session.startupId);
            else if (self.isStudent())
                var findMeetups = Meetup.findByStudent(session.studentId);

            findMeetups.then(function (meetups) {
                self.meetups(meetups);
                self.meetups.valueHasMutated();
            }).done();
        };
    }
    
    return MeetupsViewModel;
});


