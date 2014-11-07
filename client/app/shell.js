define(function (require) {
    var router = require('plugins/router');

    return {
        router: router,
        activate: function () {
            router.map([
              { route: '', title: 'Home', moduleId: 'home', nav: true },
              { route:'dashboard', title:'Dashboard', moduleId:'dashboard', nav:true }
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});