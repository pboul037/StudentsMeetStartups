define(['durandal/app', 'plugins/router', 'knockout', 'jquery.cookie'], function (app, router, ko) {

    return {
        isStartup: ko.computed(function () {
            return $.cookie('connect.startupId');
        }, this),
        isStudent: ko.computed(function () {
            return $.cookie('connect.studentId');
        }, this),
        createNewMeetup: function(item){
            item.viewUrl = 'views/createMeetupModal';
            app.showDialog(item);  
        },
        browse: function(){
            router.navigate('explore');
        },
        writeReview: function(item){
            item.viewUrl = 'views/writeReviewModal';
            app.showDialog(item);  
        },
    };
});
