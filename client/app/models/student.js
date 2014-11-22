
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
        /* resume is optional */
        /* transcript is optional */
    }

    Student.get = function (id) {
        return http.get(apiUrl + '/' + id).then(function (response) {
            return $.extend(new Student, response.student); 
        });
    };
    
    Student.findAll = function () {
        return http.get(apiUrl + 's').then(function (response) {
            var students = response.students;

            $.each(students, function (key, student) {
                students[key] = $.extend(new Student, student);
            });

            return students;
        });
    };

    Student.prototype.save = function () {
        if (this.id == null)
            return http.post(apiUrl, { 'student': this });
        else
            return http.put(apiUrl + '/' + this.id, { 'student': this });
    };
    
    return Student;
});

