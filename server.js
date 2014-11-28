// Generated by CoffeeScript 1.8.0
(function() {
  var app, debug, server;

  debug = require("debug")("app");

  app = require("./server/index");

  app.set("port", process.env.PORT || 3000);

  server = app.listen(app.get("port"), function() {
    return console.log("Express server listening on port " + server.address().port);
  });

}).call(this);
