// Need both models to populate
const { User, Thought } = require('../models');

// 2 GET routes: all users, individual user
const getUsers = async (req, res) => {
  try {
    const users = await User
          .find()
          .select('-__v');
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getOneUser = async (req, res) => {
  try {
    const user = await User
          .findById(req.params.id)
          .populate('thoughts')
          .populate('friends')
          .select('-__v');
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  getUsers,
  getOneUser,
};
