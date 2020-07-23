// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");

// USER API ROUTES
router.get("/api/users", function (req, res) {
    db.User.findAll({}).then(function (dbUser) {
        res.json(dbUser);
    });
});

router.post("/api/users", function (req, res) {
    db.User.create({
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email
    }).then(function (dbUser) {
        res.json(dbUser)
    });
});

router.delete("/api/users/:id", function (req, res) {
    db.User.destroy({
        where: {
            id: req.params.id
        }
    }).then(function (dbUser) {
        res.json(dbUser);
    });
});

// CHECK BACK WHEN FORM IS COMPLETE
router.put("/api/users", function (req, res) {
    db.User.update({
        password: req.body.password,
    }, {
        where: {
            id: req.body.id
        }
    }).res.json(dbUser)
});

// NEW DECK ROUTE
// router.get("/api/new_deck/private", function (req, res) {
//     db.Deck.findAll({
//         where: {
//             private: true 
//         }
//     }).then(function (dbUser) {
//         res.json(dbUser);
//     }).catch(function(err){
//         res.status(500).json(err)
//     });
// });
// router.get("/api/new_deck/public", function (req, res) {
//     db.Deck.findAll({
//         where: {
//             private: false 
//         }
//     }).then(function (dbUser) {
//         res.json(dbUser);
//     }).catch(function(err){
//         res.status(500).json(err)
//     });
// });

// NEW DECK ROUTE
router.post("/api/new_deck", function (req, res) {
    db.Deck.create({
        name: req.body.name,
        private: req.body.private,
        CategoryId: req.body.CategoryId,
        CreatorId: req.body.CreatorId
    }).then(function (dbDeck) {
        dbDeck.addUser(req.body.CreatorId)
        res.json(dbDeck)
        
    }).catch(function (err) {
        res.status(500).json(err)
    })
});
// DELETE DECK BY ID
router.delete("/api/delete_deck/:id", function (req, res) {
    db.Deck.destroy({
        where: {
            id: req.params.id
        }
    }).then(function (dbDeck) {
        res.json(dbDeck);
    });
});

// STARRED DECK ROUTE
router.post("/api/star_deck/:userId/:deckId", function (req, res) {
    db.User.findOne({
       where: {
           id: req.params.userId
       }
    }).then(function (dbUser) {
        res.json(dbUser.addDeck(req.params.deckId))
        console.log(dbUser)
    }).catch(function (err) {
        res.status(500).json(err)
    })
});

// NEW CARD ROUTE
router.post("/api/new_card", function (req, res) {
    db.Card.create({
      question: req.body.question,
      answer: req.body.answer,
      DeckId: req.body.DeckId
    }).then(function (dbCard) {
        res.json(dbCard)
    }).catch(function (err) {
        res.status(500).json(err)
    });
});

router.delete("/api/delete_card/:id", function (req, res) {
    db.Card.destroy({
        where: {
            id: req.params.id
        }
    }).then(function (dbCard) {
        res.json(dbCard);
    }).catch(function (err) {
        res.status(500).json(err)
    });
});

// CHECK BACK WHEN FORM IS COMPLETE
router.put("/api/update_card/:id", function (req, res) {
    db.Card.update({
        question: req.body.question,
        answer: req.body.answer
    }, {
        where: {
            id: req.params.id
        }
    }).then(function (dbCard) {
        res.json(dbCard);
    }).catch(function (err) {
        res.status(500).json(err)
    });
});
module.exports = router;