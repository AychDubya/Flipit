const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");

const db = require("./models");

const PORT = process.env.PORT || 8090;

// Express Settings
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "super secret code",
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 7200000
  }
}))

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
var hbs = exphbs.create({});
hbs.handlebars.registerHelper('addOne', function(value) {
  return value + 1;
});
hbs.handlebars.registerHelper('equals', function(a, b) {
  return a == b;
})
hbs.handlebars.registerHelper('and', function(a, b) {
  return a && b;
})

// * Routes
app.get("/seeding",(req,res)=>{
  async function seed() {
    await db.User.create({
      username: "dwats",
      password: "password",
      first_name: "Derek",
      last_name: "Watson",
    });
    await db.User.create({
      username: "ab7",
      password: "password",
      first_name: "Andrew",
      last_name: "Bergstrom",
    });
    await db.User.create({
      username: "aych-dubya",
      password: "password",
      first_name: "Hannibal",
      last_name: "Wyman",
    });
    await db.User.create({
      username: "mikey",
      password: "password",
      first_name: "Mike",
      last_name: "Shenk",
    });
    
    db.Category.bulkCreate([
      { name: "Art" }, 
      { name: "Business" }, 
      { name: "Computers" }, 
      { name: "Foreign Languages" }, 
      { name: "History" }, 
      { name: "Literature" }, 
      { name: "Mathematics" }, 
      { name: "Mixed" }, 
      { name: "Other" }, 
      { name: "Science" }, 
      { name: "Sport" }, 
      { name: "Trivia" }, 
    ])
    
    // Add decks
    db.Deck.bulkCreate([
      {
        name: "German Nouns",
        private: false,
        CategoryId: 4,
        CreatorId: 1,
      },
      {
        name: "Ichthyology",
        private: true,
        CategoryId: 10,
        CreatorId: 2,
      },
      {
        name: "Texas Trivia",
        private: false,
        CategoryId: 11,
        CreatorId: 3,
      },
      {
        name: "Bay Area Stuff",
        private: true,
        CategoryId: 9,
        CreatorId: 4,
      },
    ])
    
    // Add decks to saved decks
    // * https://sequelizedocs.fullstackacademy.com/many-many-associations/
    const users = await db.User.findAll();
    users[0].addDeck(1);
    users[1].addDeck(2);
    users[2].addDeck(3);
    users[3].addDeck(4);
    
    
    db.Card.bulkCreate([
      {
        question: "Glas",
        answer: "das",
        DeckId: 1
      },
      {
        question: "Tür",
        answer: "die",
        DeckId: 1
      },
      {
        question: "Krankenhaus",
        answer: "das",
        DeckId: 1
      },
      {
        question: "State capitol",
        answer: "Austin",
        DeckId: 3
      },
      {
        question: "Biggest city",
        answer: "Houston",
        DeckId: 3
      },
    ]).then(function(resres){
      res.send("seeded")
    })
    
    users[0].addDeck(3);
  }
  
  seed();
})

const apiRoutes = require("./controllers/api-controller.js");
app.use(apiRoutes);
const htmlRoutes = require("./controllers/html-controller.js");
app.use(htmlRoutes);


db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
  });
});
