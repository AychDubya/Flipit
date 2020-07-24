// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");
const _ = require("lodash");
const bcrypt = require('bcrypt');
const moment = require('moment');

function sessionObject(user, data) {
  return { user, data };
}


// Home page
router.get(["/", "/index", "/home"], function (req, res) {
  db.Category.findAll().then(function(categories) {
    const randomCategories = _.sampleSize(categories, 3).map(cat => {
      return { id: cat.id, name: cat.name };
    });
    res.render("index", sessionObject(req.session.user, randomCategories));
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
  res.render("search", sessionObject(req.session.user, filteredResults));
});

// Profile page
router.get("/profile", function (req, res) {
  if(req.session.user){
    db.User.findOne({
      where: {
        id: req.session.user.id,
      }
    }).then(async function (user) {
      const rawDecks = await user.getDecks();
      const decks = rawDecks.map(deck => deck.toJSON());
      res.render("profile", sessionObject(req.session.user, decks));
    });
  } else {
    res.status(401).render("error", sessionObject(
      req.session.user,
      {message: "Please login to view profile.", link: "login"}
    ));
  }
});

// Login page
router.get("/login", function (req, res) {
  res.render("login", sessionObject(req.session.user, {}));
});

router.post('/login',(req,res)=>{
  db.User.findOne({
    where: {
      username: req.body.username,
    }
  }).then(user=>{
    if (!user) {
      return res.status(404).render("error", {message: "no such user"})
    } else {
      if(bcrypt.compareSync(req.body.password, user.password)){
        req.session.user = {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        }
        res.redirect(`profile`);
      } else {
        res.status(401).send("wrong password");
      }
    }
  }).catch( err => {
    console.log(err)
    return res.status(500).end();
  })
})

// Register Page
router.get("/register", function (req, res) {
  res.render("register", sessionObject(req.session.user, {}));
});
// * to create new use POST /api/users with a req.body

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
        deck: deck.toJSON(),
        cards: deckCards.map(card => card.toJSON()),
      };
      res.render("deck", sessionObject(req.session.user, deckData));
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
    res.render("study", sessionObject(req.session.user, cards));
  });
});

// Error page
router.get("/error", function (req, res) {
  res.render("error", sessionObject(req.session.user, {message: "An error has occured", link: "home"}));
});

// Team page
router.get("/team", function(req, res) {
  res.render("Team");
})

module.exports = router;
