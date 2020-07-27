// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");
const _ = require("lodash");
const bcrypt = require('bcrypt');
const moment = require('moment');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

function sessionObject(req, data = {}) {
  const user = req.session.user 
    ? req.session.user
    : {
      id: "",
      username: null,
      first_name: null,
      last_name: null,
      email: null
    };
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

// Search Results page
router.get("/search", async function (req, res) {
  const { deck, category } = req.query;
  const results = await (async function() {
    if (deck && category) {
      return await db.Deck.findAll({
        where: {
          name: deck,
          CategoryId: parseInt(category),
        },
        include: {
          model: db.User,
          where: {
            id: {
              [Op.col]: "Deck.CreatorId"
            }
          }
        },
      });
    } else if (deck && !category) {
      return await db.Deck.findAll({
        where: {
          name: deck,
        },
        include: {
          model: db.User,
          where: {
            id: {
              [Op.col]: "Deck.CreatorId"
            }
          }
        },
      });
    } else if (category && !deck) {
      return await db.Deck.findAll({
        where: {
          CategoryId: parseInt(category),
        },
        include: {
          model: db.User,
          where: {
            id: {
              [Op.col]: "Deck.CreatorId"
            }
          }
        },
      });
    } else if (!category && !deck) {
      return await db.Deck.findAll({
        include: {
          model: db.User,
          where: {
            id: {
              [Op.col]: "Deck.CreatorId"
            }
          }
        },
      });
    }
  })();
  console.log("RESULTS:  ", results)
  const filteredResults = results.filter(item => {
    if (item.private) {
      if (item.CreatorId === req.session.id) return true;
      else return false;
    } else {
      return true;
    }
  }).map(item => {
    return {
      deck: {
        name: item.dataValues.name,
        id: item.dataValues.id,
        createdAt: formatDate(item.dataValues.createdAt),
      },
      creator: item.Users[0].dataValues,
    };
  });
  res.render("search", sessionObject(req, filteredResults));
});

// Profile page
router.get("/profile", function (req, res) {
  if(req.session.user.id){
    db.User.findOne({
      where: {
        id: req.session.user.id,
      }
    }).then(async function (user) {
      const rawDecks = await user.getDecks();
      const decks = rawDecks.map(deck => {
        return {
          name: deck.name,
          createdAt: formatDate(deck.createdAt),
        }
      });
      res.render("profile", sessionObject(req, decks));
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
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect("/", sessionObject());
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
      if (deck.private === true && req.session.id !== deck.CreatorId) {
        res.render("error", sessionObject(req, { message: "This deck is private", link: "home"}))
      } else {
        db.Card.findAll({
          where: {
            DeckId: deck.id,
          }
        }).then(function(deckCards) {
          const deckData = {
            deck: {
              name: deck.name,
              createdAt: formatDate(deck.createdAt),
            },
            creator: deck.Users[0].toJSON(),
            cards: deckCards.map(card => card.toJSON()),
          };
          console.log(deckData);
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
  db.Card.findAll({
    where: {
      DeckId: req.params.deckId,
    }
  }).then(function (cards) {
    res.render("study", sessionObject(req, cards.map(card => card.toJSON())));
  });
});

// Error pageb
router.get("/error", function (req, res) {
  res.render("error", sessionObject(req, {message: "An error has occured", link: "home"}));
});

// Team page
router.get("/team", function(req, res) {
  res.render("Team", sessionObject(req));
})

module.exports = router;
