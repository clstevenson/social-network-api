// Need both models to populate
const { User, Thought } = require('../models');

// get all users
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

// display one user with populated references
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

// Create a new user: supply username and email as input (req.body)
const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

// update one user using req.body and req.params.id
// can update email and/or username (in req.body)
const updateUser = async (req, res) => {
  try {
    const user = await User
          .findByIdAndUpdate(req.params.id, req.body, { new: true })
          .select('-__v');

    // any change in username should propagate to the username fields in thoughts and rxns
    // I changed in thoughts but rxns is more complicated (schema is poorly designed IMO)
    if (req.body.username) {
      await Thought.updateMany(
        { _id: { $in: user.thoughts } },
        { username: req.body.username },
      );
    }
    // need to get updated user to display as result
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
}

// delete user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    // also delete associated thoughts
    if (user) {
      await Thought.deleteMany({ _id: { $in: user.thoughts } })
      return res.json(`User ${user.username} was deleted`);
    }
    res.status(400).json('Could not find user');
  } catch (err) {
    res.status(500).json(err);
  }
}

// add a new friend to a given user
// constraints: cannot friend someone twice, and cannot friend yourself
const addFriend = async (req, res) => {
  try {
    if (req.params.userId === req.params.friendId) {
      return res.status(400).json('Error: a person cannot befriend themself.');
    }
    const user = await User.findById(req.params.userId);
    if (user.friends.find( friend => friend._id.toString() === req.params.friendId )) {
      return res.status(400).json(`Error: already friended by user ${req.params.friendId}`);
    }
    user.friends.push({_id: req.params.friendId});
    user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
}

// de-friending a user
const deleteFriend = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    // see if the person is actually a friend
    if (!user.friends.find( friend => friend._id.toString() === req.params.friendId )) {
      return res.status(400).json(`Error: use ${req.params.friendId} is not a friend.`);
    }
    const numFriends = user.friends.length;
    // remove the former friend's id from the array
    user.friends = user.friends.filter( friend => friend._id.toString() !== req.params.friendId );
    // see if the person was a friend or not
    if (numFriends === user.friends.length) return res(400).json('Error: No such friend.');
    user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend
};
