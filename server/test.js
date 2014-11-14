/**
 * Test suite for the server's REST API
 * 
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

var superagent = require("superagent"),
    expect = require("expect.js"),
    _ = require("lodash");

describe("StudentsMeetStartup REST API", function () {
    var startupId, studentId, meetupId;
    
    var startup = {
        companyName: "Acme Inc.",
        emailAddress: "careers@acme.com",
        websiteUrl: "http://www.acme.com",
        description: "A division of Alpha Ltd.",
        postalAddress: "75 Laurier Avenue East, Ottawa ON  K1N 6N5, Canada",
        username: "acmeadmin",
        password: "secret"
    };

    var startupCredentials = {
        username: "acmeadmin",
        password: "secret"
    };

    var updatedStartup = {
        companyName: "Acme Networks Inc.",
        emailAddress: "careers@acme.net",
        websiteUrl: "http://www.acme.net",
        description: "A division of Beta Solutions Ltd."
    };

    var student = {
        name: "Timothy Lethbridge",
        emailAddress: "tcl@site.uottawa.ca",
        phoneNumber: "6131234567",
        selfDescription: "I love Apple!",
        resume: null,
        transcript: null,
        username: "tim",
        password: "th1si5a5tr0n9password;;"
    };

    var studentCredentials = {
        username: "tim",
        password: "th1si5a5tr0n9password;;"
    };

    var updatedStudent = {
        emailAddress: "tcl@eecs.uottawa.ca",
        phoneNumber: "6132222222",
        selfDescription: "I love Microsoft!"
    };
        
    var meetup = {
        startTime: "2014-10-22 09:52:00",
        endTime: "2014-10-22 09:55:00",
        numMaxParticipants: 6
    };

    it("can create a startup", function (done) {
        http.post("/startup", { "startup": startup }).test(function (response) {
            expect(response).to.have.property("startup");
            expect(response.startup).to.have.key("id");
            expect(response.startup.id).to.be.ok();
            startupId = response.startup.id;
            startup.id = startupId;

            delete startup.username;
            delete startup.password;

            expect(response.startup).to.eql(startup);

            done();
        });
    });
    
    it("can find a statup", function (done) {
        http.get("/startup/" + startupId).test(function (response) {
            expect(response).to.have.property("startup");
            expect(response.startup).to.eql(startup);
            done();
        });
    });
    
    it("can login as a startup", function (done) {
        http.post("/login", startupCredentials).test(function (response, headers) {
            expect(response).to.have.property("startup");
            expect(response.startup).to.eql(startup);
            expect(headers).to.have.key("set-cookie");
            expect(headers["set-cookie"][0]).to.match(/^connect\.sid/);

            done();
        });
    });

    it("can update a startup", function (done) {
        http.put("/startup/" + startupId, {"startup": updatedStartup}).test(function (response) {
            expect(response).to.have.property("startup");
            expect(response.startup).to.eql(_.extend(startup, updatedStartup));
            done();
        });
    });

    it("can create a student", function (done) {
        http.post("/student", { "student": student }).test(function (response) {
            expect(response).to.have.property("student");

            expect(response.student).to.have.key("id");
            expect(response.student.id).to.be.ok();
            studentId = student.id = response.student.id;

            expect(response.student).to.have.key("accountId");
            expect(response.student.accountId).to.be.ok();
            student.accountId = response.student.accountId;
            
            delete student.username;
            delete student.password;
            
            expect(response.student).to.eql(student);

            done();
        });
    });
    
    it("can find a student", function (done) {
        http.get("/student/" + studentId).test(function (response) {
            expect(response).to.have.property("student");
            expect(response.student).to.eql(student);
            done();
        });
    });
    
    it("can login as a student", function (done) {
        http.post("/login", studentCredentials).test(function (response, headers) {
            expect(response).to.have.property("student");
            expect(response.student).to.eql(student);
            expect(headers).to.have.key("set-cookie");
            expect(headers["set-cookie"][0]).to.match(/^connect\.sid/);

            done();
        });
    });
    
    it("can update a student", function (done) {
        http.put("/student/" + studentId, {"student": updatedStudent}).test(function (response) {
            expect(response).to.have.property("student");
            expect(response.student).to.eql(_.extend(student, updatedStudent));
            done();
        });
    });

    it("can create a meetup", function (done) {
        meetup.startupId = startupId;

        http.post("/meetup", { "meetup": meetup }).test(function (response) {
            expect(response).to.have.property("meetup");
            expect(response.meetup).to.have.key("id");
            expect(response.meetup.id).to.be.ok();
            meetupId = meetup.id = response.meetup.id;

            expect(response.meetup).to.eql(meetup);

            done();
        });
    });

    it("can add a meetup participant", function (done) {
        http.post("/meetup/participant", { "meetupId": meetupId, "studentId": studentId })
            .test(function (response) { done(); });
    });

    var http = {};

    http.get = function (uri) {
        return new RouteTest("get", uri, null);
    };

    http.post = function (uri, data) {
        return new RouteTest("post", uri, data);
    };
    
    http.put = function (uri, data) {
        return new RouteTest("put", uri, data);
    };

    function RouteTest(httpVerb, uri, data)
    {
        var url = "http://localhost:3000" + uri;
        var method = superagent[httpVerb];

        this.test = function (testFunction) {
            method(url)
            .send(data)
            .end(function (error, response) {
                expect(response.status).to.be(200);
                expect(error).to.eql(null);
                expect(response.body).to.have.property("success");
                expect(response.body.success).to.be(true);
                testFunction(response.body, response.headers);
            });
        };

        return this;
    }
});

