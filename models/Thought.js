const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// Thoughts are basically posts, and reactions are
// comments on those posts. An array of reactions will
// be embedded sub-documents in the Thoughts model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      // default to current timestamp
      default: () => new Date(),
      // get method for better formatting on query
      get: (d) => d.toLocaleString(),
    },
    username: {// the user who posted the thought
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      // I think getters are true by default but just to be explicit
      getters: true,
    },
  },
);

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// compile the schema to create the collection
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
