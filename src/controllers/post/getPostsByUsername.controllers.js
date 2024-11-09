const mongoose = require('mongoose');
const { Post } = require('../../models/post.models');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');
const { postCommonAggregation } = require('./helper');
const { getMongoosePaginationOptions } = require('../../utils/helpers');

const getPostsByUsername = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const { username } = req.params;

  const user = await User.findOne({ username: username.toLowerCase() });
  // If no user is found, throw a 404 Not Found error
  if (!user) {
    const error = CustomError.notFound({
      message: 'User not found!',
      errors: ['No user found with the provided username'],
      hints: 'Please check the username and try again',
    });

    return next(error);
  }

  const postAggregation = Post.aggregate([
    {
      $match: {
        author: new mongoose.Types.ObjectId(user._id),
      },
    },
    ...postCommonAggregation(req),
  ]);

  const posts = await Post.aggregatePaginate(
    postAggregation,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: 'totalPosts',
        docs: 'posts',
      },
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, posts, 'Posts Fetched Successfully'));
});

module.exports = getPostsByUsername;
