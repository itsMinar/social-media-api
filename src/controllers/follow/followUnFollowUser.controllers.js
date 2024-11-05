const { Follow } = require('../../models/follow.models');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const followUnFollowUser = asyncHandler(async (req, res, next) => {
  const { toBeFollowedUserId } = req.params;

  // See if user that is being followed exist
  const toBeFollowed = await User.findById(toBeFollowedUserId);

  if (!toBeFollowed) {
    const error = CustomError.notFound({
      message: 'User does not exist',
      errors: ['No user found with the provided id'],
      hints: 'Please check id and try again',
    });

    return next(error);
  }

  // Check of the user who is being followed is not the one who is requesting
  if (toBeFollowedUserId.toString() === req.user._id.toString()) {
    const error = CustomError.unprocessableEntity({
      message: 'You cannot follow yourself',
      errors: ['Attempted to follow your own account'],
      hints: 'Please ensure you are following another user, not yourself',
    });

    return next(error);
  }

  // Check if logged user is already following the to be followed user
  const isAlreadyFollowing = await Follow.findOne({
    followerId: req.user._id,
    followeeId: toBeFollowed._id,
  });

  if (isAlreadyFollowing) {
    // if yes, then unfollow the user by deleting the follow entry from the DB
    await Follow.findOneAndDelete({
      followerId: req.user._id,
      followeeId: toBeFollowed._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { following: false }, 'Un-followed successfully')
      );
  } else {
    // if no, then create a follow entry to the DB
    await Follow.create({
      followerId: req.user._id,
      followeeId: toBeFollowed._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { following: true }, 'Followed successfully'));
  }
});

module.exports = followUnFollowUser;
