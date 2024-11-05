const { Comment } = require('../../models/comment.models');
const { Like } = require('../../models/like.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const likeDislikeComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  // Check for comment existence
  if (!comment) {
    const error = CustomError.notFound({
      message: 'Comment not found!',
      errors: ['No comment found with the provided id'],
      hints: 'Please check id and try again',
    });

    return next(error);
  }

  // See if user has already liked the comment
  const isAlreadyLiked = await Like.findOne({
    commentId,
    likedBy: req.user?._id,
  });

  if (isAlreadyLiked) {
    // if already liked, dislike it by removing the record from the DB
    await Like.findOneAndDelete({
      commentId,
      likedBy: req.user?._id,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isLiked: false,
        },
        'UnLike the Comment successfully'
      )
    );
  } else {
    // if not liked, like it by adding the record to the DB
    await Like.create({
      commentId,
      likedBy: req.user?._id,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isLiked: true,
        },
        'Liked the Comment successfully'
      )
    );
  }
});

module.exports = likeDislikeComment;
