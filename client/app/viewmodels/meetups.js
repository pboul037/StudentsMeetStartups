
define(function (require) {
    var router = require('plugins/router'),
        ko = require('knockout'),
        session = require('session'),
        CreateMeetupModal = require('viewmodels/createMeetupModal');

    function MeetupsViewModel()
    {
        this.isStartup = ko.observable(session.connectedAsStartup());
        this.isStudent = ko.observable(session.connectedAsStudent());

        this.createNewMeetup = function () {
            CreateMeetupModal.show();
        };

        this.browse = function () {
            router.navigate('explore');
        };

        this.writeReview = function () {

        };
    }

    return new MeetupsViewModel;
});


