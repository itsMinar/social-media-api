const mongoose = require('mongoose');
const { Follow } = require('../../models/follow.models');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');
const { getMongoosePaginationOptions } = require('../../utils/helpers');

const getFollowersListByUserName = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const user = await User.findOne({ username }).select(
    'firstName lastName username profilePhoto'
  );

  if (!user) {
    const error = CustomError.notFound({
      message: 'User does not exist',
      errors: ['No user found with the provided username'],
      hints: 'Please check the username and try again',
    });

    return next(error);
  }

  const userId = user._id;

  const followersAggregate = Follow.aggregate([
    {
      $match: {
        followeeId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'followerId',
        foreignField: '_id',
        as: 'follower',
        pipeline: [
          {
            $lookup: {
              from: 'follows',
              localField: '_id',
              foreignField: 'followeeId',
              as: 'isFollowing',
              pipeline: [
                {
                  $match: {
                    followerId: new mongoose.Types.ObjectId(req.user?._id),
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              isFollowing: {
                $cond: {
                  if: {
                    $gte: [
                      {
                        // if the isFollowing key has document in it
                        $size: '$isFollowing',
                      },
                      1,
                    ],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              firstName: 1,
              lastName: 1,
              username: 1,
              email: 1,
              profilePhoto: 1,
              bio: 1,
              location: 1,
              countryCode: 1,
              phoneNumber: 1,
              coverImage: 1,
              isFollowing: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        follower: { $first: '$follower' },
      },
    },
    {
      $project: {
        _id: 0,
        follower: 1,
      },
    },
    {
      $replaceRoot: {
        newRoot: '$follower',
      },
    },
  ]);

  const followersList = await Follow.aggregatePaginate(
    followersAggregate,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: 'totalFollowers',
        docs: 'followers',
      },
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, ...followersList },
        'Followers list fetched successfully'
      )
    );
});

module.exports = getFollowersListByUserName;
