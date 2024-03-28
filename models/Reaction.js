const { Schema, Types } = require('mongoose');

// Reaction is schema-only, it will be incorporated as an
// array of embedded sub-documents in the Thought model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      // default to current timestamp
      default: () => new Date(),
      // get method for better formatting on query
      get: (d) => d.toLocaleString(),
    },
  },
);

module.exports = reactionSchema;
