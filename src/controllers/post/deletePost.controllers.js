const { Post } = require('../../models/post.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  // update the post
  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) {
    const error = CustomError.notFound({
      message: 'Post not found!',
      errors: ['No post found with the provided id'],
      hints: 'Please check id and try again',
    });

    return next(error);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Post Deleted Successfully'));
});

module.exports = deletePost;
