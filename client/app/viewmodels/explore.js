define(function (require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        http = require('plugins/http'),
        Student = require('models/student'),
        session = require('session');

    return {
        logout : function () {
            session.logout();
        },
        students: ko.observableArray([]),
        startups: ko.observableArray([]),
        activate: function () {
            
            var self = this;
            
            self.isStartup = ko.observable(session.connectedAsStartup());
            self.isStudent = ko.observable(session.connectedAsStudent());
            
            if (self.isStartup())
                {
                    return http.get('http://192.168.56.101/students').then(function(response) {
                        self.students(response.students);
                    });
                }
            else if (self.isStudent())
                {
                    return http.get('http://192.168.56.101/startups').then(function(response) {
                        self.startups(response.startups);
                    });
                }
        }
    };
});