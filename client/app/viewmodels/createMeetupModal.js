define(function (require) {
    var dialog = require('plugins/dialog'),
        ko = require('knockout'),
        Meetup = require('models/meetup'),
        session = require('session');

    function CreateMeetupModal()
    {
        var self = this;

        self.meetup = ko.observable(new Meetup(session.startupId));

        self.createMeetup = function () {
            self.meetup().save()
            .fail(self.showError)
            .then(self.close)
            .done();
        };

        self.close = function () {
            dialog.close(self);
        };

        self.showError = function (error) {
            /* @TODO */
        };
    }

    CreateMeetupModal.show = function () {
        return dialog.show(new CreateMeetupModal);
    };

    return CreateMeetupModal;
});
