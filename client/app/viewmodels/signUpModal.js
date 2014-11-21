define(function (require) {
    var http = require('plugins/http'),
        router = require('plugins/router'),
        ko = require('knockout'),
        dialog = require('plugins/dialog'),
        Student = require('models/student'),
        Startup = require('models/startup'),
        session = require('session'),
        toastr = require('toastr')

    ko.mapping = require('knockout.mapping');
    ko.validation = require('knockout.validation');
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "progressBar": false,
      "positionClass": "toast-bottom-full-width",
      "onclick": null,
      "showDuration": "750",
      "hideDuration": "750",
      "timeOut": "1000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    
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
        
        self.credentials = ko.validatedObservable({
            username : ko.observable()
                .extend({
                    required: true,
                    minLength:4
            }),
            password : ko.observable()
                .extend({
                    required: true,
                    passwordComplexity: {
                        params: self.password
                    },
                    minLength: 6
            }),
        });
        
        self.passwordConfirmation = ko.validatedObservable()
                .extend({ areSame: { 
                    params: self.credentials().password, 
                    message: "Confirm password must match password"}
        });
        
        self.name = ko.validatedObservable()
            .extend({
                required: true
        }),
        self.companyName = ko.validatedObservable()
                .extend({
                    required: true
        }); 
        
        self.nameIsValid = ko.computed( function() {
            return self.name.isValid() || self.companyName.isValid();
        }, this);
        
        self.model = ko.observable({});
        self.model(new Student);
        self.accountType = ko.observable('student');      
        
        
        self.isStudentAccount = ko.computed(function () {
            return (self.accountType() == 'student');
        }, this);
        self.isStartupAccount = ko.computed(function () {
            return (self.accountType() == 'startup');
        }, this);
    
        self.changeAccountType = function () {
            if (self.isStudentAccount()){
                self.model(new Student);
                self.companyName(undefined);
            }else if (self.isStartupAccount()){
                self.model(new Startup);
                self.name(undefined);
            }
            return true;
        };
        
        self.signup = function (self) {
            self.model().name = self.name();
            self.model().username = self.credentials().username();
            self.model().password = self.credentials().password();
            self.model().companyName = self.companyName();
            ko.mapping.toJS(self.model).save()
            .then(session.login.bind(session, self.credentials().username(),self.credentials().password()))
            .fail(showError)
            .done(funtciont(){
                  toastr.success('Thank you for registering!');
                  dialog.close(this)
            }); 
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