
define(function (require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        InformationViewModel = require('viewmodels/information');

    function DashboardViewModel()
    {
        var self = this;

        self.information = new InformationViewModel;
        self.name = ko.observable();
        self.activate = function () {
            app.on('information:name-changed').then(function (newName) {
                self.name(newName);
            });
            return self.information.activate();
        };
    }

    return new DashboardViewModel;
});


