
define(['durandal/app', 'plugins/http', 'plugins/router', 'knockout', 'viewmodels/signUpModal'], function (app, http, router, ko, SignUpModal) {
    
    var url = 'http://192.168.56.101/login';

    return {
        username: ko.observable(),
        password: ko.observable(),
        errorMessage: ko.observable(),
        toJSON: function () {
            return {username: this.username, password: this.password};
        },
        signup: function(){
            SignUpModal.show();
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

