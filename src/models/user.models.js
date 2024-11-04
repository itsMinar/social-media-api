const { Schema, model, models } = require('mongoose');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      enum: ['male', 'female', 'others'],
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
  if (this.username) next();

  try {
    let uniqueUsername;
    let isUnique = false;

    while (!isUnique) {
      uniqueUsername = `user-${uuid().slice(0, 8)}`;
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

// Pre-save hook to hash the password before store in DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Custom method to compare plain password with the hashed password in the user document
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Custom method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Custom method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = model('User', userSchema);

module.exports = { User };
