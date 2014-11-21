
define(function (require) {
    var router = require('plugins/router'),
        ko = require('knockout'),
        session = require('session'),
        CreateMeetupModal = require('viewmodels/createMeetupModal'),
        http = require('plugins/http')

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
            //TODO: TBA, form GUI is done but missing validation and main logic.
        };
        
        self.meetups = ko.observableArray([]);

        self.isStartup = ko.observable(session.connectedAsStartup());
        self.isStudent = ko.observable(session.connectedAsStudent());
        self.myMeetupsStartup = ko.observableArray([]);
        self.myMeetupsStudent = ko.observableArray([]);
        
        self.activate = function () {
            return http.get('http://192.168.56.101/meetups').done(function(response) {
                  self.meetups(response.meetups);
          }).done(function(){
                ko.utils.arrayForEach(self.meetups(), function(meetup) {
                    if( session.connectedAsStartup()){
                        if( meetup.startupId == session.startupId ){
                            self.myMeetupsStartup.push(meetup);
                        }
                    }else if( session.connectedAsStudent()){
                        // Push all this student's myMeetups onto its ucoming meetups list
                    }
                });
            }); 
        };
    }
    
    return MeetupsViewModel;
});


