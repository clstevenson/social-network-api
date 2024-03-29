const router = require('express').Router();
const { getUsers, getOneUser } = require('../../controllers/userController');

// /api/users routes
router.route('/').get(getUsers);

// /api/users/:userID routes
router.route('/:id').get(getOneUser);

module.exports = router;
