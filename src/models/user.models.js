const { Schema, model, models } = require('mongoose');
const { randomUUID } = require('crypto');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
      lowercase: true,
      trim: true,
    },
    dob: {
      type: Date,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    countryCode: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    refreshToken: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Pre-validate hook to auto-generate a unique username
userSchema.pre('validate', async function (next) {
  try {
    let uniqueUsername;
    let isUnique = false;

    while (!isUnique) {
      uniqueUsername = `user-${randomUUID()}`; // TODO: will use another id generator package
      const existingUser = await models.User.findOne({
        username: uniqueUsername,
      });
      if (!existingUser) {
        isUnique = true;
      }
    }
    this.username = uniqueUsername;
    next();
  } catch (err) {
    next(err);
  }
});

const User = model('User', userSchema);

module.exports = { User };
