/*
 * Abstraction model for student domain objects. Manages all communication with the server
 * that are related to this object.
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

define(function (require) {
    var http = require('plugins/http');

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
        return http.get('/student/' + id).then(function (response) {
            return $.extend(new Student, response.student); 
        });
    };
    
    Student.findAll = function () {
        return http.get('/students').then(function (response) {
            var students = response.students;

            $.each(students, function (key, student) {
                students[key] = $.extend(new Student, student);
            });

            return students;
        });
    };

    Student.prototype.save = function () {
        if (this.id == null)
            return http.post('/student', { 'student': this });
        else
            return http.put('/student/' + this.id, { 'student': this });
    };
    
    return Student;
});

