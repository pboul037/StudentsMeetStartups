define(function (require) {
    var app = require('durandal/app'),
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

        self.isStartup = ko.observable();
        self.isStudent = ko.observable();

        self.activate = function () {
            return session.getUser().done(function (user) {
                self.model = ko.mapping.fromJS(user);

                self.isStartup(session.connectedAsStartup());
                self.isStudent(session.connectedAsStudent());
                
                if (self.isStartup())
                {
                    self.model.companyName.extend({ minLength: 4 });
                    self.model.companyName.subscribe(self.nameChanged);
                    self.model.companyName.valueHasMutated();
                    self.model.description.extend({ maxLength: 150 });
                    self.model.postalAddress.extend({ minLength: 4 });
                }
                else if (self.isStudent())
                {
                    self.model.name.extend({ minLength: 4 });
                    self.model.name.subscribe(self.nameChanged);
                    self.model.name.valueHasMutated();
                    self.model.selfDescription.extend({ maxLength: 150 });
                    self.model.phoneNumber.extend({ minLength: 10 });
                }
                
                self.model.emailAddress.extend({ email: true, minLength: 4 });
            });
        };
        
        self.nameChanged = function (newValue) {
            app.trigger('information:name-changed', newValue);
        };
        
        self.attached = function () {
            $('#inputResume').on('change', function (event) {
                self.resume = event.target.files;
            });

            $('#inputTranscript').on('change', function (event) {
                self.transcript = event.target.files;
            });
        };

        self.save = function () {
            var save = ko.mapping.toJS(self.model).save();
            
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
