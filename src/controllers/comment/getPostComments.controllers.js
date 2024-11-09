const mongoose = require('mongoose');
const { Comment } = require('../../models/comment.models');
const { Post } = require('../../models/post.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');
const { getMongoosePaginationOptions } = require('../../utils/helpers');

const getPostComments = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    const error = CustomError.notFound({
      message: 'Post not found!',
      errors: ['No post found with the provided id'],
      hints: 'Please check id and try again',
    });

    return next(error);
  }

  const commentAggregation = Comment.aggregate([
    {
      $match: {
        postId: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'commentId',
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'commentId',
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
              username: 1,
              firstName: 1,
              lastName: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: { $first: '$author' },
        likes: { $size: '$likes' },
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
  ]);

  const comments = await Comment.aggregatePaginate(
    commentAggregation,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: 'totalComments',
        docs: 'comments',
      },
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comments, 'Post Comments Fetched Successfully'));
});

module.exports = getPostComments;
