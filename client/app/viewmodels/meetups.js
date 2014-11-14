define(['durandal/app', 'plugins/router', 'knockout'], function (app, router, ko) {

    return {
        createNewMeetup: function(item){
            item.viewUrl = 'views/newMeetupModal';
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