const Thought = require('../models/Thought');

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

module.exports = {
  getThoughts,
  getOneThought,
  getReactions,
}
