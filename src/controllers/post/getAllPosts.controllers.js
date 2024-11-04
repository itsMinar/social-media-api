const { Post } = require('../../models/post.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getAllPosts = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, allPosts, 'All Posts Fetched Successfully'));
});

module.exports = getAllPosts;
