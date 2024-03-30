const { Thought, User } = require('../models');
const { findById } = require('../models/User');

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
// supply: thoughtText, username, id (as JSON in req.body)
// Normally the latter two would probably be part of a session cookie set
// after successful login (so I'm not checking for mismatch or verifying that the user exists)
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
// presumably only logged in user can add a rxn so no validation of username
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

// delete thought by its ID
const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (thought) {
      return res.json(`Thought by ${thought.username} was deleted.`);
    }
    res.status(400).json(`Could not find thought with id ${req.params.id}`);
  } catch (err) {
    res.status(500).json(err);
  }

}

// delete reaction by ID; pass reactionId property as JSON in req.body
const deleteReaction = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    thought.reactions = thought.reactions.filter( (rxn) => rxn.reactionId.toString() !== req.body.reactionId);
    thought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  getThoughts,
  getOneThought,
  createThought,
  createReaction,
  updateThought,
  deleteThought,
  deleteReaction
};
