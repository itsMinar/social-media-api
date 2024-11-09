const mongoose = require('mongoose');

const postCommonAggregation = (userId) => {
  return [
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'postId',
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'postId',
        as: 'isLiked',
        pipeline: [
          {
            $match: {
              likedBy: new mongoose.Types.ObjectId(userId),
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: 'owner',
        as: 'author',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'account',
              pipeline: [
                {
                  $project: {
                    avatar: 1,
                    email: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          { $addFields: { account: { $first: '$account' } } },
        ],
      },
    },
    {
      $addFields: {
        author: { $first: '$author' },
        likes: { $size: '$likes' },
        comments: { $size: '$comments' },
        isLiked: {
          $cond: {
            if: {
              $gte: [
                {
                  // if the isLiked key has document in it
                  $size: '$isLiked',
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
  ];
};

module.exports = { postCommonAggregation };
