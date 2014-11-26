/*
 * View model for the startup/student exploration page. Handles user input and updates views and communicates with
 * the server accordingly.
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

define(function (require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        Student = require('models/student'),
        Startup = require('models/startup'),
        Meetup = require('models/meetup'),
        session = require('session'),
        notify = require('notify');

    function ExploreViewModel()
    {
        var self = this;

        self.logout = function () {
            session.logout();
        };
        
        self.students = ko.observableArray([]);
        self.startups = ko.observableArray([]);
            
        self.isStartup = ko.observable();
        self.isStudent = ko.observable();

        self.activate = function () {
            self.isStartup(session.connectedAsStartup());
            self.isStudent(session.connectedAsStudent());
            
            if (self.isStartup())
                return Student.findAll().then(self.students);
            else if (self.isStudent())
                return Startup.findAll().then(self.saveStartups);
        };

        self.saveStartups = function (startups) {
            Meetup.findByStudent(session.studentId).then(function (registeredMeetups) {
                $.each(registeredMeetups, function (key, meetup) {
                    registeredMeetups[key] = meetup.id;
                });

                $.each(startups, function (startupKey, startup) {
                    $.each(startup.meetups, function (meetupKey, meetup) {
                        startups[startupKey].meetups[meetupKey].registered = ko.observable((registeredMeetups.indexOf(meetup.id) > -1));
                    });
                });

                self.startups(startups);
            });
        };

        self.enroll = function (meetup) {
            if (!meetup.registered())
            {
                meetup.addParticipant(session.studentId).then(function() {
                    notify.success('Succesfully registered to the meetup!'); 
                });
                meetup.registered(true);
            }
        };
    }

    return new ExploreViewModel;
});

