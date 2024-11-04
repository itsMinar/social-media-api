const { Comment } = require('../../models/comment.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  // find the comment and delete it
  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    const error = CustomError.notFound({
      message: 'Comment not found!',
      errors: ['No comment found with the provided id'],
      hints: 'Please check id and try again',
    });

    return next(error);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Comment Deleted Successfully'));
});

module.exports = deleteComment;
