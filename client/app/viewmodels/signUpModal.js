
define(function (require) {
    var http = require('plugins/http'),
        router = require('plugins/router'),
        ko = require('knockout'),
        dialog = require('plugins/dialog'),
        validator = require('bootstrapvalidator'),
        Student = require('models/student'),
        Startup = require('models/startup'),
        session = require('session');

    function SignUpModal()
    {
        var self = this;

        self.passwordConfirmation = ko.observable();
        self.model = ko.observable({});

        self.accountType = ko.observable();

        self.isStudentAccount = ko.computed(function () {
            return (self.accountType() == 'student');
        }, this);
        self.isStartupAccount = ko.computed(function () {
            return (self.accountType() == 'startup');
        }, this);
    
        self.changeAccountType = function () {
            if (self.isStudentAccount())
                self.model(new Student);
            else if (self.isStartupAccount())
                self.model(new Startup);

            return true;
        };
        
        self.signup = function (self) {
            self.model().save()
            .then(session.login.bind(session, self.model().username, self.model().password))
            .fail(showError)
            .done();
        };
    }

    function redirectToDashboard()
    {
        dialog.close(this);
        router.navigate('dashboard');
    }

    function showError(error)
    {
        /* @TODO */
    }
    
    SignUpModal.show = function () {
        return dialog.show(new SignUpModal);
    };
                
    return SignUpModal;
});

