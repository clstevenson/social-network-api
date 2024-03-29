const router = require('express').Router();
const { getUsers,
        getOneUser,
        createUser,
        updateUser
      } = require('../../controllers/userController');

// /api/users routes
router.route('/').get(getUsers).post(createUser);

// /api/users/:userID routes
router.route('/:id').get(getOneUser).put(updateUser);

module.exports = router;
