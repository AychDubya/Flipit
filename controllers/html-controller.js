// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");
const _ = require("lodash");



router.get("/", function (req, res) {
  db.Category.findAll().then(function(categories) {
    const randomCategories = _.sampleSize(categories, 3).map(cat => {
      return { id: cat.id, name: cat.name };
    });
    res.send(JSON.stringify(randomCategories));
  });
});

// * /search?deck=German%20Nouns&category=4&userId=
router.get("/search", async function (req, res) {
  const { deck, category, userId } = req.query;
  let results;
  if (deck && category) {
    results = await db.Deck.findAll({
      where: {
        name: deck,
        CategoryId: category,
      }
    });
  } else if (deck && !category) {
    results = await db.Deck.findAll({
      where: {
        name: deck,
      }
    });
  } else if (category && !deck) {
    results = await db.Deck.findAll({
      where: {
        CategoryId: category,
      }
    });
  } else if (!category && !deck) {
    results = await db.Deck.findAll();
  }
  const filteredResults = results.filter(item => {
    if (item.private) {
      if (item.CreatorId === parseInt(userId)) {
        return item;
      }
    } else {
      return item;
    }
  })
  res.json(filteredResults);
});

router.get("/login", function (req, res) {
  res.send("Login");
});

router.get("/register", function (req, res) {
  res.send("Register");
});

router.get("/deck/:id", function (req, res) {
  res.send("deck search");
});

router.get("/study/:deckId", function (req, res) {
  res.send(req.params.deckId);
});

module.exports = router;




router.get("/api/new_deck/private", function (req, res) {
  db.Deck.findAll({
      where: {
          private: true 
      }
  }).then(function (dbUser) {
      res.json(dbUser);
  }).catch(function(err){
      res.status(500).json(err)
  });
});
router.get("/api/new_deck/public", function (req, res) {
  db.Deck.findAll({
      where: {
          private: false 
      }
  }).then(function (dbUser) {
      res.json(dbUser);
  }).catch(function(err){
      res.status(500).json(err)
  });
});