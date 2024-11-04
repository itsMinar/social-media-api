const { Post } = require('../../models/post.models');
const { updatePostSchema } = require('../../schemas/post.schemas');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const updatePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  // validate the request
  const parsedBody = updatePostSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // update the post
  const updatedPost = await Post.findByIdAndUpdate(
    { _id: postId },
    { $set: { ...parsedBody.data } },
    { new: true }
  );

  if (!updatedPost) {
    const error = CustomError.notFound({
      message: 'Post not found!',
      errors: ['No post found with the provided id'],
      hints: 'Please check id and try again',
    });

    return next(error);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, 'Post Updated Successfully'));
});

module.exports = updatePost;
