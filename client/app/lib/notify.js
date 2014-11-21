/**
 * Toastr notifications global configuration
 *
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

define(function (require) {
    var toastr = require('toastr');

    toastr.options = {
      "closeButton": false,
      "debug": false,
      "progressBar": false,
      "positionClass": "toast-bottom-full-width",
      "onclick": null,
      "showDuration": "750",
      "hideDuration": "750",
      "timeOut": "750",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    return toastr;
});

