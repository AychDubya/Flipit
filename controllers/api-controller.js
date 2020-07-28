// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");
const nodemailer = require("nodemailer");


    // * USER API ROUTES
    // Get all users
    router.get("/api/users", function (req, res) {
        db.User.findAll({}).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    router.get("/api/exists/username/:username", function (req, res) {
        db.User.count({
            where: {
                username: req.params.username,
            }
        }).then(function (dbUser) {
            res.json(dbUser > 0);
        });
    });

    // Create new user
    router.post("/api/users", function (req, res) {
        console.log("testing")
        db.User.create({
            username: req.body.username,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }).then(function (dbUser) {
            res.json(dbUser)
            if (req.body.email) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'FlipItStudy@gmail.com',
                      pass: 'FlippedOut2020'
                    }
                  });
                  
                  var mailOptions = {
                    from: 'FlipItStudy@gmail.com',
                    to: `${req.body.email}`,
                    subject: 'Sending Email using Node.js',
                    text: 'Thank you for using FlipIt to study! Get started learning'
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            }
        });
    });



    // Delete user
    router.delete("/api/users/:id", function (req, res) {
        db.User.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    // Change password
    router.put("/api/users", function (req, res) {
        db.User.update({
            password: req.body.password,
        }, {
            where: {
                id: req.body.id
            }
        }).res.json(dbUser)
    });

    // * DECK API ROUTES
    // Create new deck
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

    // Delete deck by id
    router.delete("/api/delete_deck", function (req, res) {
        db.Deck.destroy({
            where: {
                id: req.body.id
            }
        }).then(function (dbDeck) {
            console.log("Deck deleted!");
            db.Card.destroy({
                where: {
                    DeckId: req.body.id,
                }
            }).then(function(results) {
                console.log("cards deleted");
                res.redirect(`/profile`);
            })
        });
    });

    // * STARREDDECK API ROUTES
    // Star a deck as user
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

    // * CARD API ROUTES
    // New card route
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

    // Delete card route
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

    // Update card route
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