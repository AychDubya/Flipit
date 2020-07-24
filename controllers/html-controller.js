// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");
const _ = require("lodash");


// Home page
router.get("/", function (req, res) {
  db.Category.findAll().then(function(categories) {
    const randomCategories = _.sampleSize(categories, 3).map(cat => {
      return { id: cat.id, name: cat.name };
    });
    res.render("index", randomCategories);
  });
});

// Search Results page
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
  res.render("search", filteredResults);
});

// Profile page
router.get("/user/:id", function (req, res) {
  console.log(req.params)
  db.User.findOne({
    where: {
      id: req.params.id,
    }
  }).then(async function (user) {
    const userDecks = await user.getDecks();
    res.render("profile", userDecks);
  });
});

// Login page
router.get("/login", function (req, res) {
  res.render("login");
});

// Register Page
router.get("/register", function (req, res) {
  res.render("register");
});

// View deck page
router.get("/deck/:id", function (req, res) {
  db.Deck.findOne({
    where: {
      id: req.params.id,
    }
  }).then(function (deck) {
    db.Card.findAll({
      where: {
        DeckId: deck.id,
      }
    }).then(function(deckCards) {
      const deckData = {
        deck: deck,
        cards: deckCards,
      };
      res.render("deck", deckData);
    })
  });
});

// Study page
router.get("/study/:deckId", function (req, res) {
  db.Card.findAll({
    where: {
      DeckId: req.params.deckId,
    }
  }).then(function (cards) {
    res.render("study", cards);
  });
});

// Error page
router.get("/error", function (req, res) {
  res.render("error", req.body.message);
});

// Team page
router.get("/team", function(req, res) {
  res.render("Team");
})

module.exports = router;
