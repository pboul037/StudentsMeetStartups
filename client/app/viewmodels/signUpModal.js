
define(function (require) {
    var http = require('plugins/http'),
        router = require('plugins/router'),
        ko = require('knockout'),
        dialog = require('plugins/dialog'),
        validator = require('bootstrapvalidator');
           
    var loginUrl = 'http://192.168.56.101/login';
  
    var SignUpModal = function() {
        this.name = ko.observable('');
        this.username = ko.observable();
        this.password = ko.observable();
        this.passwordConfirmation = ko.observable();
        this.accountType = ko.observable();
    };
        
    SignUpModal.prototype.toJSON = function () {
        var res = {username: this.username, password: this.password};
            
        if (this.accountType() == 'startup')
            res.companyName = this.name;
        else
            res.name = this.name;

        return res;
    };
        
    SignUpModal.prototype.signup = function (self) {
        console.log(self);
        console.log(ko.toJSON(self));
        var url = 'http://192.168.56.101';
        url += self.accountType() == 'startup' ? '/startup' : '/student';
        http
        .post(url, {student: self.toJSON()})
        .then(function (data) {
            return http.post(loginUrl, {username: self.username, password: self.password}); })
        .then(function (data) { dialog.close(self); router.navigate('dashboard'); })
        .fail(function (error) { self.errorMessage(error.responseText); })
        .done();
    };
    
    SignUpModal.show = function(){
        return dialog.show(new SignUpModal());
    };
                
    return SignUpModal;
});

