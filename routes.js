"use strict";
const simple = require("./handlers/simple");
const configured = require("./handlers/configured");

module.exports.default = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.get("/", simple);
  app.get("/configured", configured(opts));

  // Define API Routes
  app.use("/api/users", require("./controllers/users"));
  app.use("/api/auth", require("./controllers/auth"));
  app.use("/api/messages", require("./controllers/messages"));
  app.use("/api/createmessages", require("./controllers/createMessages"));
  app.use("/api/connection", require("./controllers/connections"));
};
