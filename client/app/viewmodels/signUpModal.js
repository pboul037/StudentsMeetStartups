define(function (require) {
    var app = require('durandal/app'),
        http = require('plugins/http'),
        router = require('plugins/router'),
        ko = require('knockout');

    var loginUrl = 'http://192.168.56.101/login';

    return {
        name: ko.observable(),
        username: ko.observable(),
        password: ko.observable(),
        passwordConfirmation: ko.observable(),
        accountType: ko.observable(),
        toJSON: function () {
            var json = {username: this.username, password: this.password};
            
            if ( this.accountType == 'startup' )
                json.companyName: this.name;
            else
                json.name : this.name;

            return json;
        },
        signup: function (self) {
            var url = 'http://192.168.56.101';
            url += self.accountType() == 'startup' ? '/startup' : '/student';

            http
            .post(url, self)
            .then(function (data) {
                return http.post(loginUrl, {username: this.username, password: this.password});
            })
            .then(function (data) { router.navigate('dashboard'); })
            .fail(function (error) { self.errorMessage(error.responseText); })
            .done();
        }
    };
});
