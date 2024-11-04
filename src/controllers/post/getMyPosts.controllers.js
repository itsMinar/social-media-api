const { Post } = require('../../models/post.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const getMyPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({
    author: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, 'My Posts Fetched Successfully'));
});

module.exports = getMyPosts;
