const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { userData, thoughtData, reactionData } = require('./data');

/** FUNCTION DEFINITIONS **/
// get a random username
const getUsername = () => {
  const randomUser = Math.floor(Math.random() * userData.length);
  return userData[randomUser].username;
};

// get a random sample of reactions (up to max input value)
// no attempt made to prevent duplicates
const getReactions = (max) => {
  const randomSize = Math.floor(Math.random() * (max + 1));
  const reactions = [];
  for (let i = 0; i < randomSize; i++) {
    const randomIndex = Math.floor(Math.random() * reactionData.length);
    reactions.push(reactionData[randomIndex]);
  }
  return reactions;
}

// populate thoughts collection with all thoughts and randomly assign the user
// add between 0 and 5 randomly selected reactions to the thought
const thoughts = thoughtData.map((text) => {
  const obj = {};
  obj.thoughtText = text;
  // will eventually re-assign the username
  obj.username = getUsername();
  obj.reactions = [];
  const rxnArray = getReactions(5);
  for (const rxn of rxnArray) {
    const rxnObj = {};
    rxnObj.reactionBody = rxn;
    rxnObj.username = getUsername();
    obj.reactions.push(rxnObj);
  }
  return obj;
});

// I guess this checks for errors? I didn't see any documentation on Mongoose
connection.on('error', (err) => err);

connection.once('open', async () => {

  // populate thought collection (delete any prior collection if it exists)
  const thoughtsCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtsCheck.length) await connection.dropCollection('thoughts');
  const thoughtsColl = await Thought.insertMany(thoughts);

  // now we populate each user, connecting to the correct thought and randomly assigning friends
  const users = userData.map((user) => {
    const obj = {};
    obj.username = user.username;
    obj.email = user.email;
    obj.thoughts = [];
    // find the thoughts assigned to this user
    // for each one, get the _id of the thought
    for (let i = 0; i < thoughts.length; i++) {
      if (thoughts[i].username == user.username) obj.thoughts.push(thoughtsColl[i]['_id']);
    }
    return obj;
  });

  // populate user collection (delete any prior collection if it exists)
  const usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (usersCheck.length) await connection.dropCollection('users');
  const userColl = await User.insertMany(users);

  // now that we have all user _id values, need to assign friends
  // for seed data I'm not going to worry about a person "friending" themself
  // for convenience let's get all the user IDs in an array
  const userObjIds = userColl.map((user) => user._id);
  // now loop thru the users and create 0-3 friends for each
  for (const user of userColl) {
    const numFriends = Math.floor(Math.random() * 4);
    for (let i = 0; i < numFriends; i++) {
      const friendIndex = Math.floor(Math.random() * userObjIds.length);
      user.friends.push(userObjIds[friendIndex]);
    }
    // update this user's document
    await user.save();
  }

  console.info('Seeding complete! 🌱');
  process.exit(0);
});
