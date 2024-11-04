const { Comment } = require('../../models/comment.models');
const { Post } = require('../../models/post.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const getPostComments = asyncHandler(async (req, res, next) => {
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

  const comments = await Comment.find({ postId: post._id });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, 'Post Comments Fetched Successfully'));
});

module.exports = getPostComments;
