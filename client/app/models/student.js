
define(function (require) {
    var http = require('plugins/http');

    var apiUrl = 'http://192.168.56.101/student';

    function Student()
    {
        this.id = null;
        this.name = '';
        this.emailAddress = '';
        this.phoneNumber = '';
        this.selfDescription = '';
        this.resume = null;
        this.transcript = null;
    }

    Student.get = function (id) {
        return http.get(apiUrl + '/' + id);
    };

    Student.prototype.save = function () {
        if (this.id == null)
            return http.post(apiUrl, { 'student': this });
        else
            return http.put(apiUrl, { 'student': this });
    };

    return Student;
});

