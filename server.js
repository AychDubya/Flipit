const express = require("express");
var exphbs = require("express-handlebars");
var milligram = require("milligram");

const db = require("./models");
const seed = require("./seeds.js");

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
const apiRoutes = require("./controllers/api-controller.js");
app.use(apiRoutes);
const htmlRoutes = require("./controllers/html-controller.js");
app.use(htmlRoutes);

const PORT = process.env.PORT || 8080;

db.sequelize.sync({ force: true }).then(function () {
  seed();
  app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
  });
});
