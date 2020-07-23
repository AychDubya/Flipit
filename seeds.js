// ! To seed: node seeds.js

// Access table
const db = require("./models");

module.exports = async function () {
  db.User.bulkCreate([
    {
      username: "dwats",
      password: "password",
      first_name: "Derek",
      last_name: "Watson",
    },
    {
      username: "ab7",
      password: "password",
      first_name: "Andrew",
      last_name: "Bergstrom",
    },
    {
      username: "aych-dubya",
      password: "password",
      first_name: "Hannibal",
      last_name: "Wyman",
    },
    {
      username: "mikey",
      password: "password",
      first_name: "Mike Shenk",
      last_name: "Wyman",
    },
  ])

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

  db.Deck.bulkCreate([
    {
      name: "German Nouns",
      private: false,
      CategoryId: 4,
      CreatorId: 1,
    },
    {
      name: "Ichthyology",
      private: false,
      CategoryId: 10,
      CreatorId: 2,
    },
    {
      name: "Texas Trivia",
      private: false,
      CategoryId: 11,
      CreatorId: 3,
    },
  ])

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
  
  const users = await db.User.findAll();
  const decks = await db.Deck.findAll();


  users[0].addDeck(decks[2]);
}