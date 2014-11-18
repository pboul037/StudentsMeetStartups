define(function (require) {
    var app = require('durandal/app'),
        http = require('plugins/http'),
        ko = require('knockout'),
        Student = require('models/student'),
        Startup = require('models/startup'),
        session = require('session');

    ko.mapping = require('knockout.mapping');

    function InformationViewModel()
    {
        var self = this;
        
        self.resume = null;
        self.transcript = null;

        self.activate = function () {
            return session.getUser().then(function (user) {
                self.model = ko.mapping.fromJS(user);

                if (self.isStartup())
                {
                    self.model.companyName.subscribe(function (newValue) { app.trigger('information:name-changed', newValue); });
                    self.model.companyName.valueHasMutated();
                }
                else if (self.isStudent())
                {
                    self.model.name.subscribe(function (newValue) { app.trigger('information:name-changed', newValue); });
                    self.model.name.valueHasMutated();
                }
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
            var save = ko.mapping.toJS(self.model).save();

            if (self.isStudent())
            {   
                if (self.resume != null)
                    save.then(self.uploadResume);
                if (self.transcript != null)
                    save.then(self.uploadTranscript);
            }

            save.done();
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
