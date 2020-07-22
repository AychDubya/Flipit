const express = require("express");
var exphbs = require("express-handlebars");

const db = require("./models");

// Express Settings
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

// * Routes
// * uncomment routes when built
// var apiRoutes = require("./controllers/api-controller.js");
// app.use(apiRoutes);
// var htmlRoutes = require("./controllers/html-controller.js");
// app.use(htmlRoutes);

const PORT = process.env.PORT || 8080;

db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});
