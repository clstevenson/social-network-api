const router = require('express').Router();
const { getUsers,
        getOneUser,
        createUser
      } = require('../../controllers/userController');

// /api/users routes
router.route('/').get(getUsers).post(createUser);

// /api/users/:userID routes
router.route('/:id').get(getOneUser);

module.exports = router;
