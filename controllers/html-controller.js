// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", function (req, res) {
  res.send("Home");
});

router.get("/search", function (req, res) {
  let queryObj = req.query;
  res.send(JSON.stringify(queryObj));
});

router.get("/login", function (req, res) {
  res.send("Login")
});

router.get("/register", function (req, res) {
  res.send("Register");
});

router.get("/deck/:id", function (req, res) {
  res.send(req.params.id);
});

router.get("/deck/:id", function (req, res) {
  res.send(req.params.id);
});

router.get("/study/:deckId", function (req, res) {
  res.send(req.params.deckId);
});

module.exports = router;