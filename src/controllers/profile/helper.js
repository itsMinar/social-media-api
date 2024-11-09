const mongoose = require('mongoose');
const { User } = require('../../models/user.models');
const { Follow } = require('../../models/follow.models');

const getUserProfile = async (userId, req) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error(404, 'User does not exist');
  }

  let profile = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        profilePhoto: 1,
        username: 1,
        email: 1,
      },
    },
    {
      $lookup: {
        from: 'follows',
        localField: 'owner',
        foreignField: 'followerId',
        as: 'following',
      },
    },
    {
      $lookup: {
        from: 'follows',
        localField: 'owner',
        foreignField: 'followeeId',
        as: 'followedBy',
      },
    },
    {
      $addFields: {
        followersCount: { $size: '$followedBy' },
        followingCount: { $size: '$following' },
      },
    },
    {
      $project: {
        followedBy: 0,
        following: 0,
      },
    },
  ]);

  let isFollowing = false;

  if (req.user?._id && req.user?._id?.toString() !== userId.toString()) {
    // Check if there is a logged in user and logged in user is NOT same as the profile that is being loaded
    // In such case we will check if the logged in user follows the loaded profile user
    const followInstance = await Follow.findOne({
      followerId: req.user?._id, // logged in user. If this is null `isFollowing` will be false
      followeeId: userId,
    });
    isFollowing = followInstance ? true : false;
  }

  const userProfile = profile[0];

  if (!userProfile) {
    throw new Error(404, 'User profile does not exist');
  }
  return { ...userProfile, isFollowing };
};

module.exports = { getUserProfile };
