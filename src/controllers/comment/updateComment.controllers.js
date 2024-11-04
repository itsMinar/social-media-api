const { Comment } = require('../../models/comment.models');
const { updateCommentSchema } = require('../../schemas/comment.schemas');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const updateComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  // validate the request
  const parsedBody = updateCommentSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // find the comment and update it
  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: commentId },
    { $set: { ...parsedBody.data } },
    { new: true }
  );

  if (!updatedComment) {
    const error = CustomError.notFound({
      message: 'Comment not found!',
      errors: ['No comment found with the provided id'],
      hints: 'Please check id and try again',
    });

    return next(error);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, 'Comment Updated Successfully'));
});

module.exports = updateComment;
