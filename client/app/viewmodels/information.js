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
        
        self.activate = function () {
            return session.getUser().then(function (user) {
                self.model = ko.mapping.fromJS(user);

                console.log(self.model);

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

        self.save = function () {
            ko.mapping.toJS(self.model).save().done();
        };
    }

    return InformationViewModel;
});
