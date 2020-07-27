const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");

const db = require("./models");

const PORT = process.env.PORT || 8080;

// Express Settings
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "super secret code",
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 7200000
  }
}))

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
var hbs = exphbs.create({});
hbs.handlebars.registerHelper('addOne', function(value) {
  return value + 1;
});

// * Routes
const apiRoutes = require("./controllers/api-controller.js");
app.use(apiRoutes);
const htmlRoutes = require("./controllers/html-controller.js");
app.use(htmlRoutes);


db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
  });
});
