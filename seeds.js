// Access table
const db = require("./models");

module.exports = async function () {
  db.User.Create({
    username: "dwats",
    password: "password",
    first_name: "Derek",
    last_name: "Watson",
  });
  db.User.Create({
    username: "ab7",
    password: "password",
    first_name: "Andrew",
    last_name: "Bergstrom",
  });
  db.User.Create({
    username: "aych-dubya",
    password: "password",
    first_name: "Hannibal",
    last_name: "Wyman",
  });
  db.User.Create({
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
  ])

  users[0].addDeck(3);
}