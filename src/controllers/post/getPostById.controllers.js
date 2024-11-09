const mongoose = require('mongoose');
const { Post } = require('../../models/post.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');
const { postCommonAggregation } = require('./helper');

const getPostById = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    ...postCommonAggregation(req),
  ]);

  if (!post[0]) {
    const error = CustomError.notFound({
      message: 'Post not found!',
      errors: ['No post found with the provided id'],
      hints: 'Please check id and try again',
    });

    return next(error);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post[0], 'Post Fetched Successfully'));
});

module.exports = getPostById;
