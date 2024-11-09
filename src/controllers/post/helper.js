const mongoose = require('mongoose');

const postCommonAggregation = (req) => {
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
              likedBy: new mongoose.Types.ObjectId(req?.user?._id),
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
        pipeline: [
          {
            $project: {
              profilePhoto: 1,
              email: 1,
              username: 1,
            },
          },
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
