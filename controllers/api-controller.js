// * Put all routes in the same controller (api & html)?
const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/api/users", function (req, res) {
    db.User.findAll({}).then(function (dbUser) {
        res.json(dbUser);
    });
});

router.post("/api/users", function (req, res) {
    db.User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
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


module.exports = router;