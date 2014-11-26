/*
 * Main application shell. Defines the client-side routes through which the users can navigate.
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

define(function (require) {
    var router = require('plugins/router');

    return {
        router: router,
        activate: function () {
            router.map([
              { route: '', title: 'Home', moduleId: 'viewmodels/home', nav: true },
              { route:'dashboard', title:'Dashboard', moduleId:'viewmodels/dashboard', nav:true },
              { route:'explore', title:'Explore', moduleId:'viewmodels/explore', nav:true },
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});
