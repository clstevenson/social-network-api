const router = require('express').Router();
const {
  getThoughts,
  getOneThought,
  getReactions,
  createThought,
  createReaction
} = require('../../controllers/thoughtController');

// /api/thoughts routes
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:id routes
router.route('/:id').get(getOneThought);

// api/thoughts/:id/reactions
router.route('/:id/reactions').get(getReactions).post(createReaction);

module.exports = router;
