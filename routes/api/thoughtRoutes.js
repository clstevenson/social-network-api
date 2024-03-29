const router = require('express').Router();
const {
  getThoughts,
  getOneThought,
  getReactions
} = require('../../controllers/thoughtController');

// /api/thoughts routes
router.route('/').get(getThoughts);

// /api/thoughts/:id routes
router.route('/:id').get(getOneThought);

// api/thoughts/:id/reactions
router.route('/:id/reactions').get(getReactions);

module.exports = router;
