const mongoose = require('mongoose');
const { Follow } = require('../../models/follow.models');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const getFollowingListByUserName = asyncHandler(async (req, res, next) => {
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

  const followings = await Follow.find({
    followerId: new mongoose.Types.ObjectId(userId),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, followings, 'Following list fetched successfully')
    );
});

module.exports = getFollowingListByUserName;
