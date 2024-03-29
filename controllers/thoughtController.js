const { Thought, User } = require('../models');

// 3 GET routes: all thoughts, individual thought, reactions to a given thought
const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().select('-__v');
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getOneThought = async (req, res) => {
  try {
    const thought = await Thought
      .findById(req.params.id)
      .select('-__v');
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getReactions = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    res.json(thought.reactions);
  } catch (err) {
    res.status(500).json(err);
  }
}

// Create a new thought post for a given user
// supply: thoughtText, username, id
// Normally the latter two would probably be part of a session cookie set
// after successful login (don't check for mismatch)
const createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    // need to add the thought ID to the reference array of the user
    const user = await User.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { thoughts: thought._id } },
    );
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
}

// creates a reaction to a post
// data input: reactionBody (JSON), username (JSON), thoughtID (req.param)
// returns the updated thought + all rxns to it
const createReaction = async (req, res) => {
  try {
    const reaction = await Thought.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reactions: {
            reactionBody: req.body.reactionBody,
            username: req.body.username,
          },
        },
      },
      { new: true }
    );
    res.json(reaction);
  } catch (err) {
    res.status(500).json(err);
  }
}

// update a thought by its ID
// req.body contains updated thoughtText
// (assume username doesn't change)
const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.id,
      { thoughtText: req.body.thoughtText },
      { new: true }
    ).select('-__v');
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  getThoughts,
  getOneThought,
  getReactions,
  createThought,
  createReaction,
  updateThought
};
