const router = require('express').Router();
const {
  getThoughts,
  getOneThought,
  createThought,
  createReaction,
  updateThought,
  deleteThought,
  deleteReaction
} = require('../../controllers/thoughtController');

// /api/thoughts routes
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:id routes
router.route('/:id').get(getOneThought).put(updateThought).delete(deleteThought);

// api/thoughts/:id/reactions
router.route('/:id/reactions').post(createReaction).delete(deleteReaction);

module.exports = router;
