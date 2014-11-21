
define(function (require) {
    var http = require('plugins/http'),
        router = require('plugins/router'),
        ko = require('knockout'),
        SignUpModal = require('viewmodels/signUpModal'),
        session = require('session');
    
    function HomeViewModel()
    {
        var self = this;

        self.username = ko.observable();
        self.password = ko.observable();

        self.errorMessage = ko.observable();

        self.signup = function () {
            SignUpModal.show();
        };

        self.login = function () {
            session.login(self.username(), self.password())
            .fail(self.showError)
            .done();
        };

        self.showError = function (error) {
            self.errorMessage(error.responseText);
        };

        self.activate = function () {
            if (session.connectedAsStartup() || session.connectedAsStudent())
                router.navigate('dashboard');
        };
    }

    return new HomeViewModel;
});

