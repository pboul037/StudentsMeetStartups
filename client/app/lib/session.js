/**
 * Login session management
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

define(function (require) {
    var http = require('plugins/http'),
        router = require('plugins/router'),
        Student = require('models/student'),
        Startup = require('models/startup');

    require('jquery.cookie');

    function Session()
    {
        var self = this;

        self.login = function (username, password) {
            var credentials = { 'username': username, 'password': password };
            var url = '/login';
        
            return http.post(url, credentials)
            .then(function (response) {
                if (response.hasOwnProperty('student'))
                    self.studentId = response.student.id;            
                else if (response.hasOwnProperty('startup'))
            {
                console.log('should create cookie!');
                    self.startupId = response.startup.id;            
            }

                redirectToDashboard();
            });
        };

        self.logout = function (redirect) {
            $.removeCookie('connect.sid');
            $.removeCookie('connect.studentId');
            $.removeCookie('connect.startupId');

            redirectToHome();
        };

        function redirectToHome()
        {
            router.navigate('');
        }

        function redirectToDashboard()
        {
            router.navigate('dashboard');
        }
        
        self.connectedAsStartup = function () {
            return !!self.startupId;
        };
        
        self.connectedAsStudent = function () {
            return !!self.studentId;
        };

        self.getUser = function () {
            if (self.connectedAsStartup())
                return Startup.get(self.startupId);
            else if (self.connectedAsStudent())
                return Student.get(self.studentId);
            else
                return $.Deferred().reject('Not connected').promise();
        };
    }

    Object.defineProperty(Session.prototype, 'startupId', {
        get: function () { return $.cookie('connect.startupId'); },
        set: function (val) { $.cookie('connect.startupId', val); }
    });
    
    Object.defineProperty(Session.prototype, 'studentId', {
        get: function () { return $.cookie('connect.studentId'); },
        set: function (val) { $.cookie('connect.studentId', val); }
    });

    return new Session;
});

