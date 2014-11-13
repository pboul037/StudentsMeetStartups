define(['durandal/app', 'plugins/router', 'knockout'], function (app, router, ko) {

    return {
        signup: function(item){
            item.viewUrl = 'views/signUpModal';
            app.showDialog(item);  
        },
        login: function(){
            router.navigate('dashboard');
        }
    };
});