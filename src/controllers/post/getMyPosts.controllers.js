const mongoose = require('mongoose');
const { Post } = require('../../models/post.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { postCommonAggregation } = require('./helper');
const { getMongoosePaginationOptions } = require('../../utils/helpers');

const getMyPosts = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const postAggregation = Post.aggregate([
    {
      $match: {
        author: new mongoose.Types.ObjectId(req.user?._id),
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
    .json(new ApiResponse(200, posts, 'My Posts Fetched Successfully'));
});

module.exports = getMyPosts;
