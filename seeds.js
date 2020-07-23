// ! To seed: node seeds.js

// Access table
const db = require("./models");

module.exports = function () {
  db.User.create({
    username: "dwats117",
    password: "password",
    first_name: "Derek",
    last_name: "Watson"
  })
  
  db.User.create({
    username: "ab7",
    password: "password",
    first_name: "Andrew",
    last_name: "Bergstrom"
  })

  db.User.create({
    username: "hw1234",
    password: "password",
    first_name: "Hanny",
    last_name: "dubya"
  })
}