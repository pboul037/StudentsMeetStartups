define(function (require) {
    var app = require('durandal/app'),
        http = require('plugins/http'),
        ko = require('knockout'),
        Student = require('models/student'),
        Startup = require('models/startup'),
        session = require('session'),
        toastr = require('toastr');

    ko.mapping = require('knockout.mapping');
    ko.validation = require('knockout.validation');
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "progressBar": false,
      "positionClass": "toast-bottom-full-width",
      "onclick": null,
      "showDuration": "500",
      "hideDuration": "500",
      "timeOut": "500",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    function InformationViewModel()
    {
        var self = this;
        
        self.resume = null;
        self.transcript = null;

        self.activate = function () {
            
            return session.getUser().done(function (user) {
                self.model = ko.mapping.fromJS(user);
                
                if (self.isStartup())
                {
                    self.studentOrStartupName = ko.validatedObservableObservable(self.model.companyName())
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
                }
                self.studentOrStartupName.subscribe(function (newValue) { app.trigger('information:name-changed', newValue); });
                self.studentOrStartupName.valueHasMutated();
                
                self.dataModel = ko.validatedObservable({

                    phoneNumber: ko.observable(self.model.phoneNumber())
                        .extend({
                            minLength:10
                    }),
                    emailAddress: ko.observable(self.model.emailAddress())
                        .extend({
                            email: true,
                            minLength: 4
                    })
                });
            });
        };
        
        self.isStartup = ko.observable(session.connectedAsStartup());
        self.isStudent = ko.observable(session.connectedAsStudent());
        
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
            modelToSave.phoneNumber = self.dataModel().phoneNumber();
            modelToSave.emailAddress = self.dataModel().emailAddress();
            
            if( self.isStudent()){
                modelToSave.name = self.studentOrStartupName();
                modelToSave.selfDescription = self.studentOrStartupDescription();
            }else if (self.isStartup()){
                modelToSave.companyName = self.studentOrStartupName();
                modelToSave.description = self.studentOrStartupDescription();
                modelToSave.postalAddress = self.dataModel().postalAddress();
            }
            
            var save = modelToSave.save();
            
            if (self.isStudent())
            {   
                if (self.resume != null)
                    save.then(self.uploadResume);
                if (self.transcript != null)
                    save.then(self.uploadTranscript);
            }

            save.done( function(){
                toastr.success('Saved!', { fadeAway: 100,  });
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
