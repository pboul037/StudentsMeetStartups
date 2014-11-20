define(function (require) {
    var http = require('plugins/http'),
        router = require('plugins/router'),
        ko = require('knockout'),
        dialog = require('plugins/dialog'),
        Student = require('models/student'),
        Startup = require('models/startup'),
        session = require('session');

    ko.mapping = require('knockout.mapping');
    ko.validation = require('knockout.validation');
    
    function SignUpModal()
    {       
         ko.validation.rules['areSame'] = {
            getValue: function (o) {
                return (typeof o === 'function' ? o() : o);
            },
            validator: function (val, otherField) {
                return val === this.getValue(otherField);
            },
            message: 'The fields must have the same value'
        };
        
        ko.validation.rules['passwordComplexity'] = {
            validator: function (val) {
                return /(?=^[^\s]{6,128}$)((?=.*?\d)(?=.*?[A-Z])(?=.*?[a-z])|(?=.*?\d)(?=.*?[^\w\d\s])(?=.*?[a-z])|(?=.*?[^\w\d\s])(?=.*?[A-Z])(?=.*?[a-z])|(?=.*?\d)(?=.*?[A-Z])(?=.*?[^\w\d\s]))^.*/.test('' + val + '');
            },
            message: 'Password must be between 6 and 128 characters long and contain three of the following 4 items: upper case letter, lower case      letter, a symbol, a number'
        };
        ko.validation.registerExtenders();

        var self = this;
        self.errors = ko.validation.group(self, { deep: true });
        self.errorsComputed = ko.computed(function() {
            return self.errors().length > 0;
        }, self);
        
        self.model = ko.observable({});
        
        self.model(new Student);
        self.accountType = ko.observable('student');
                
        self.name = ko.observable('')
            .extend({
                required: true
        });
        
        self.companyName = ko.observable('')
            .extend({
                required: true
        });
        
        self.username = ko.observable('')
            .extend({
                required: true,
                minLength:4
        });
        
        self.password = ko.observable('')
            .extend({
                required: true,
                passwordComplexity: {
                    params: self.password
                },
                minLength: 6
        });
        
        self.passwordConfirmation = ko.observable('')
            .extend({ areSame: { 
                params: self.password, 
                message: "Confirm password must match password"}
        });
        
        
        
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
            self.model().name = self.name();
            self.model().username = self.username();
            self.model().password = self.password();
            self.model().companyName = self.companyName();
            ko.mapping.toJS(self.model).save()
            .then(session.login.bind(session, self.username(),self.password()))
            .fail(showError)
            .done(dialog.close(this));
        };       
    }

    function showError(error)
    {
        alert("There was an error while processing you form, please try again.");
    }
    
    SignUpModal.show = function () {
        return dialog.show(new SignUpModal);
    };
    
    return SignUpModal;
});