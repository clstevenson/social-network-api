const { Schema, model } = require('mongoose');

// Schema for user
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // set up email regex validator
      match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
      minLength: 1, // I read that empty strings pass the match validator
    },
    // references array of thoughts posted by the user
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thought',
      },
    ],
    // references array of friends of the user (by their user "_id")
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    }
  }
);

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// compile the schema to create the collection
const User = model('user', userSchema);

module.exports = User;
