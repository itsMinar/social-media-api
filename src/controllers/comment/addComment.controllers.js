const { Comment } = require('../../models/comment.models');
const { addCommentSchema } = require('../../schemas/comment.schemas');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const addComment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  // validate the request
  const parsedBody = addCommentSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  const comment = await Comment.create({
    ...parsedBody.data,
    postId,
    author: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, 'Comment Added Successfully'));
});

module.exports = addComment;
