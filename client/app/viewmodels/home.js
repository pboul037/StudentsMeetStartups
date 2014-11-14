
define(function (require) {
    var app = require('durandal/app'),
        http = require('plugins/http'),
        router = require('plugins/router'),
        ko = require('knockout');

    var url = 'http://192.168.56.101/login';

    return {
        username: ko.observable(),
        password: ko.observable(),
        errorMessage: ko.observable(),
        toJSON: function () {
            return {username: this.username, password: this.password};
        },
        signup: function (self) {
            app.showDialog('viewmodels/signUpModal');  
        },
        login: function (self) {
            http
            .post(url, self)
            .then(function (data) { router.navigate('dashboard'); })
            .fail(function (error) { self.errorMessage(error.responseText); })
            .done();
        }
    };
});

