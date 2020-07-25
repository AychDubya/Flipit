// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
// async function main(emailAddress) {
//     // Generate test SMTP service account from ethereal.email
//     // Only needed if you don't have a real mail account for testing
//     let testAccount = await nodemailer.createTestAccount();
//     console.log(testAccount);
    
  
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: , // generated ethereal user
//         pass: testAccount.pass, // generated ethereal password
//       },
//     });
  
//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: 'Andrew_j1206@hotmail.com', // sender address
//       to: emailAddress , // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });
  
//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   }

    // * USER API ROUTES
    // Get all users
    router.get("/api/users", function (req, res) {
        db.User.findAll({}).then(function (dbUser) {
            res.json(dbUser);
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
    router.delete("/api/delete_deck/:id", function (req, res) {
        db.Deck.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbDeck) {
            res.json(dbDeck);
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