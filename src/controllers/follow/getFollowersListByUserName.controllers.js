const mongoose = require('mongoose');
const { Follow } = require('../../models/follow.models');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const getFollowersListByUserName = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    const error = CustomError.notFound({
      message: 'User does not exist',
      errors: ['No user found with the provided username'],
      hints: 'Please check the username and try again',
    });

    return next(error);
  }

  const userId = user._id;

  const followers = await Follow.find({
    followeeId: new mongoose.Types.ObjectId(userId),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, followers, 'Followers list fetched successfully')
    );
});

module.exports = getFollowersListByUserName;
