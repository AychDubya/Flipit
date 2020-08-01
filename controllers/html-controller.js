// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");
const _ = require("lodash");
const bcrypt = require('bcrypt');
const moment = require('moment');
const Sequelize = require("sequelize");
const { where } = require("sequelize");
const Op = Sequelize.Op;

function sessionObject(req, data = {}) {
  let user;
  if (req.session && req.session.user) {
    user = req.session.user;
  } else {
    user = {
      id: "",
      username: null,
      first_name: null,
      last_name: null,
      email: null,
      createdAt: null,
    }
  }
  return { user, data };
}

function formatDate(date) {
  return moment(date).format("MM/DD/YY");
}

// Home page
router.get(["/", "/index", "/home"], function (req, res) {
  db.Category.findAll().then(function(categories) {
    const randomCats = _.sampleSize(categories, 3).map(cat => {
      return { id: cat.id, name: cat.name };
    });
    const allCats = categories.map(cat => {
      return { id: cat.id, name: cat.name };
    });
    const data = { explore: randomCats, categories: allCats };
    res.render("index", sessionObject(req, data));
  });
});

router.get("/search", async function(req, res) {
  // Get search terms
  const { deck, category } = req.query;
  // Get all categories
  const allCats = await db.Category.findAll();
  const allCatsParsed = allCats.map(cat => {
    return { id: cat.id, name: cat.name };
  });
  // Create where object for query based on search terms
  const whereObj = {};
  if (deck) whereObj.name = deck;
  if (category) whereObj.CategoryId = category ? parseInt(category) : "";
  // Find all decks
  db.Deck.findAll({
    where: whereObj,
  }).then(async function(deckResults) {
    const creatorPromises = [];
    const countPromises = [];
    // Get creator info and card count for each deck as promises
    for (const deck of deckResults) {
      creatorPromises.push(await db.User.findOne({
        where: { id: deck.CreatorId },
      }));
      countPromises.push(await db.Card.count({
        where: { DeckId: deck.id },
      }));
    }
    // Wait for all promises to resolve
    const creators = await Promise.all(creatorPromises);
    const cardCounts = await Promise.all(countPromises);
    // Get userId if logged in to display delete button on each owned deck
    const userId = req.session.user ? req.session.user.id : "";
    // Create array that combines all info for each deck
    const results = Array.from({length: deckResults.length}, (val, index) => {
      const resultItem = {
        deck: deckResults[index].toJSON(),
        creator: creators[index].toJSON(),
        cardCount: cardCounts[index],
        userId: userId,
      };
      resultItem.deck.createdAt = formatDate(resultItem.deck.createdAt);
      return resultItem;
    })
    // Create page data object with results, search terms and categories
    const pageData = {
      results: results,
      search: {
        resultCount: results.length,
        deck: deck ? deck : "None",
        category: category ? allCatsParsed[category - 1].name : "None",
      },
      categories: allCatsParsed
    }
    // Render results
    res.render("search", sessionObject(req, pageData));
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

// Profile page
router.get("/profile", async function (req, res) {
  const allCats = await db.Category.findAll();
  const allCatsParsed = allCats.map(cat => {
    return { id: cat.id, name: cat.name };
  });

  if(req.session.user){
    db.User.findOne({
      where: {
        id: req.session.user.id,
      },
    }).then(function (user) {
      user.getDecks().then(async function (rawDecks) {
        const decks = [];
        for (const deck of rawDecks) {
          const cardCount = await db.Card.count({
            where: {
              DeckId: deck.id,
            }
          });
          const creator = await db.User.findOne({
            where: {
              id: deck.CreatorId,
            }
          })
          decks.push({
            deck: {
              name: deck.name,
              id: deck.id,
              createdAt: formatDate(deck.createdAt),
              cardCount: cardCount,
            },
            creator: creator.dataValues,
            userId: req.session.user.id,
          });
        }
        const pageData = {
          decks: decks,
          categories: allCatsParsed,
        }
        res.render("profile", sessionObject(req, pageData));
      });
    });
  } else {
    res.status(401).render("error", sessionObject(
      req,
      {message: "Please login to view profile.", link: "login"}
    ));
  }
});

// Login page
router.get("/login", function (req, res) {
  res.render("login", sessionObject(req));
});

router.post('/login', function (req, res) {
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
          email: user.email,
          createdAt: formatDate(user.createdAt),
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

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect("/");
})

// Register Page
// to create new user POST /api/users with a req.body
router.get("/register", function (req, res) {
  res.render("register", sessionObject(req));
});

// View deck page
router.get("/deck/:id", function (req, res) {
  db.Deck.findOne({
    where: {
      id: req.params.id,
    }, 
    include: {
      model: db.User,
      where: {
        id: {
          [Op.col]: "Deck.CreatorId"
        }
      }
    }
  }).then(function (deck) {
    if (deck) {
      if (deck.private === true && req.session.user.id !== deck.CreatorId) {
        res.render("error", sessionObject(req, { message: "This deck is private", link: "home"}))
      } else {
        db.Card.findAll({
          where: {
            DeckId: deck.id,
          }
        }).then(function(deckCards) {
          const userId = req.session.user ? req.session.user.id : "";
          const deckData = {
            deck: {
              name: deck.name,
              id: deck.id,
              createdAt: formatDate(deck.createdAt),
            },
            creator: deck.Users[0].toJSON(),
            cards: deckCards.map(card => {
              const cardObj = card.toJSON();
              cardObj.deckCreator = deck.id;
              cardObj.currentUser = userId;
              return cardObj
            }),
          };
          res.render("deck", sessionObject(req, deckData));
        })
      }
    } else {
      res.render("error", sessionObject(req, {message: "No deck found", link: "home"}))
    }
  });
});

// Study page
router.get("/study/:deckId", function (req, res) {
  db.Deck.findOne({
    where: {
      id: req.params.deckId,
    }
  }).then(function (deck) {
    res.render("study", sessionObject(req, deck.name));
  });
});

// Error page
router.get("/error", function (req, res) {
  res.render("error", sessionObject(req, {message: "An error has occured", link: "home"}));
});

// Team page
router.get("/team", function(req, res) {
  res.render("team", sessionObject(req));
})

module.exports = router;
