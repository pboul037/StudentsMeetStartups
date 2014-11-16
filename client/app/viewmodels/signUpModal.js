
define(function (require) {
    var http = require('plugins/http'),
        router = require('plugins/router'),
        ko = require('knockout'),
        dialog = require('plugins/dialog'),
        validator = require('bootstrapvalidator'),
        Student = require('models/student'),
        Startup = require('models/startup');

    require('jquery.cookie');
           
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
            .then(login.bind(self))
            .then(redirectToDashboard.bind(self))
            .fail(showError)
            .done();
        };
    }

    function login()
    {
        var credentials = { 'username': this.model().username, 'password': this.model().password };
        var url = 'http://192.168.56.101/login';

        return http.post(url, credentials).then(function (data) {
            if (data.student)
                $.cookie('connect.studentId', data.student.id);
            else if (data.startup)
                $.cookie('connect.startupId', data.startup.id);
        });
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

