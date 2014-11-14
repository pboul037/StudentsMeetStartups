define(function (require) {
    var app = require('durandal/app'),
        http = require('plugins/http'),
        router = require('plugins/router'),
        ko = require('knockout'),
        dialog = require('plugins/dialog');

    var loginUrl = 'http://192.168.56.101/login';

    return {
        name: ko.observable('Nicholas Gagnon'),
        username: ko.observable(),
        password: ko.observable(),
        passwordConfirmation: ko.observable(),
        accountType: ko.observable(),
        toJSON: function () {
            var res = {username: this.username, password: this.password};
            
            if (this.accountType() == 'startup')
                res.companyName = this.name;
            else
                res.name = this.name;

            return res;
        },
        signup: function (self) {
            var url = 'http://192.168.56.101';
            url += self.accountType() == 'startup' ? '/startup' : '/student';

            http
            .post(url, {student: self.toJSON()})
            .then(function (data) {
                return http.post(loginUrl, {username: self.username(), password: self.password()}); })
            .then(function (data) { dialog.close(self); router.navigate('dashboard'); })
            .fail(function (error) { self.errorMessage(error.responseText); })
            .done();
        }
    };
});
