// Generated by CoffeeScript 1.8.0
(function() {
  "use strict";
  exports.setRender = function(view) {
    return function(req, res, next) {
      if (view) {
        req.render = view;
      }
      return next();
    };
  };

  exports.setRedirect = function(options) {
    return function(req, res, next) {
      if (options) {
        req.redirect = options;
      }
      return next();
    };
  };

}).call(this);
