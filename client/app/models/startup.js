
define(function (require) {
    var http = require('plugins/http');

    var apiUrl = 'http://192.168.56.101/startup';

    function Startup()
    {
        this.id = null;
        this.companyName = '';
        this.emailAddress = '';
        this.description = '';
        this.postalAddress = '';
    }

    Startup.get = function (id) {
        return http.get(apiUrl + '/' + id).then(function (response) {
            return $.extend(new Startup, response.startup); 
        });
    };

    Startup.prototype.save = function () {
        if (this.id == null)
            return http.post(apiUrl, { 'startup': this });
        else
            return http.put(apiUrl + '/' + this.id, { 'startup': this });
    };

    return Startup;
});

