define(function (require) {
    var dialog = require('plugins/dialog'),
        ko = require('knockout'),
        Meetup = require('models/meetup'),
        session = require('session'),
        toastr = require('toastr')

    ko.mapping = require('knockout.mapping');
    ko.validation = require('knockout.validation');
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "progressBar": false,
      "positionClass": "toast-bottom-full-width",
      "onclick": null,
      "showDuration": "750",
      "hideDuration": "750",
      "timeOut": "750",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    function CreateMeetupModal()
    {
        var self = this;
        
        self.meetup = ko.validatedObservable({
            id: ko.observable(null),
            startupId: ko.observable(session.startupId)
                .extend({
                required: true
            }),
            startTime : ko.observable()
                .extend({
                required: true
            }),
            endTime : ko.observable()
                .extend({
                    required: true
            }),
            numMaxParticipants : ko.observable()
                .extend({
                    required: true,
                    maxLength: 15
            }),
            location : ko.observable()
                .extend({
                    required: true,
                    minLength: 5
            })
        });

        self.createMeetup = function () {
            self.meetupData = new Meetup(session.startupId);
            self.meetupData.id = self.meetup().id();
            self.meetupData.startupId = self.meetup().startupId();
            self.meetupData.startTime = self.meetup().startTime();
            self.meetupData.endTime = self.meetup().endTime();
            self.meetupData.numMaxParticipants = self.meetup().numMaxParticipants();
            
            self.meetupData.save()
            .fail(self.showError)
            .then(self.close)
            .done(function(){
                 toastr.success('Meetup created!');
            }); 
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
