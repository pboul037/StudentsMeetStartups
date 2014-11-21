define(function (require) {
    var app = require('durandal/app'),
        http = require('plugins/http'),
        ko = require('knockout'),
        Student = require('models/student'),
        Startup = require('models/startup'),
        session = require('session'),
        notify = require('notify');

    ko.mapping = require('knockout.mapping');
    ko.validation = require('knockout.validation');
    
    function InformationViewModel()
    {
        var self = this;
        
        self.resume = null;
        self.transcript = null;

        self.activate = function () {
            
            return session.getUser().done(function (user) {
                self.model = ko.mapping.fromJS(user);
                self.isStartup = ko.observable(session.connectedAsStartup());
                self.isStudent = ko.observable(session.connectedAsStudent());
                
                if (self.isStartup())
                {
                    self.studentOrStartupName = ko.validatedObservable(self.model.companyName())
                        .extend({
                            minLength:4
                    });
                    
                    self.studentOrStartupDescription = ko.validatedObservable(self.model.description())
                        .extend({
                            maxLength: 150
                    });
                    self.postalAddress = ko.validatedObservable(self.model.postalAddress())
                        .extend({
                            minLength: 4
                    });
                }
                else if (self.isStudent())
                {
                    self.studentOrStartupName = ko.validatedObservable(self.model.name())
                        .extend({
                            minLength:4
                    });
                    
                    self.studentOrStartupDescription = ko.validatedObservable(self.model.selfDescription())
                        .extend({
                            maxLength: 150
                    });
                    self.phoneNumber = ko.validatedObservable(self.model.phoneNumber())
                        .extend({
                            minLength:10
                    });
                }
                
                self.emailAddress = ko.validatedObservable(self.model.emailAddress())
                        .extend({
                            email: true,
                            minLength: 4
                });
                
                self.studentOrStartupName.subscribe(function (newValue) { app.trigger('information:name-changed', newValue); });
                self.studentOrStartupName.valueHasMutated();
            });
        };
        
        self.attached = function (view, parent) {
            self.inputResume = $('#inputResume');
            self.inputTranscript = $('#inputTranscript');

            self.inputResume.on('change', function (event) {
                self.resume = event.target.files;
            });

            self.inputTranscript.on('change', function (event) {
                self.transcript = event.target.files;
            });
        };

        self.save = function () {
            
            var modelToSave = ko.mapping.toJS(self.model);
            modelToSave.phoneNumber = self.phoneNumber();
            modelToSave.emailAddress = self.emailAddress();
            
            if( self.isStudent()){
                modelToSave.name = self.studentOrStartupName();
                modelToSave.selfDescription = self.studentOrStartupDescription();
            }else if (self.isStartup()){
                modelToSave.companyName = self.studentOrStartupName();
                modelToSave.description = self.studentOrStartupDescription();
                modelToSave.postalAddress = self.postalAddress();
            }
            
            var save = modelToSave.save();
            
            if (self.isStudent())
            {   
                if (self.resume != null)
                    save.then(self.uploadResume);
                if (self.transcript != null)
                    save.then(self.uploadTranscript);
            }

            save.done(function () {
                notify.success('Saved!', { fadeAway: 100 });
            });
        };

        self.uploadResume = function () {
            return self.uploadFile('resume', self.resume);
        };

        self.uploadTranscript = function () {
            return self.uploadFile('transcript', self.transcript);
        };

        self.uploadFile = function (name, files) {
            var data = new FormData();
            
            $.each(files, function (key, value) {
                data.append(key, value);
            });

            return $.ajax({
                url: 'http://192.168.56.101/student/' + self.model.id() + '/' + name,
                type: 'PUT',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false,
                contentType: false
            });
        };
    }

    return InformationViewModel;
});
