const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');
const { getUserProfile } = require('./helper');

const getProfileByUsername = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select(
    '-password -refreshToken'
  );

  if (!user) {
    const error = CustomError.notFound({
      message: 'User not found!',
      errors: ['No user found with the provided username'],
      hints: 'Please check the username and try again',
    });

    return next(error);
  }

  const userProfile = await getUserProfile(user._id, req);

  return res
    .status(200)
    .json(
      new ApiResponse(200, userProfile, 'User profile fetched successfully')
    );
});

module.exports = getProfileByUsername;
