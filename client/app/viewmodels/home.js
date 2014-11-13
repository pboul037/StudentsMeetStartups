define(['durandal/app', 'knockout'], function (app, ko) {

    return {
        signup: function(item){
            item.viewUrl = 'views/signUpModal';
            app.showDialog(item);  
        } 
    };
});