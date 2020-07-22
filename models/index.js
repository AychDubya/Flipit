"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
// Check enivronment
var env = process.env.NODE_ENV || "development";
// Get config for that environment
var config = require(__dirname + "/../config/config.json")[env];
var db = {};

// Set up sequelize based on the
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  // Only pull certain files from this directory
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  // Add access to this file in the db object
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// For each item in the db object, if it can associate, associate it with the db
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sequelize (defined above) to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// export the db
module.exports = db;
