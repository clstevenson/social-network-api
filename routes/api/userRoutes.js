const router = require('express').Router();
const { getUsers,
        getOneUser,
        createUser,
        updateUser,
        deleteUser,
        addFriend,
        deleteFriend
      } = require('../../controllers/userController');

// /api/users routes
router.route('/').get(getUsers).post(createUser);

// /api/users/:userID routes
router.route('/:id').get(getOneUser).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;
