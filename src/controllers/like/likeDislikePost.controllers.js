const { Like } = require('../../models/like.models');
const { Post } = require('../../models/post.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const likeDislikePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  // Check for post existence
  if (!post) {
    const error = CustomError.notFound({
      message: 'Post not found!',
      errors: ['No post found with the provided id'],
      hints: 'Please check id and try again',
    });

    return next(error);
  }

  // See if user has already liked the post
  const isAlreadyLiked = await Like.findOne({
    postId,
    likedBy: req.user?._id,
  });

  if (isAlreadyLiked) {
    // if already liked, dislike it by removing the record from the DB
    await Like.findOneAndDelete({
      postId,
      likedBy: req.user?._id,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isLiked: false,
        },
        'UnLike the Post successfully'
      )
    );
  } else {
    // if not liked, like it by adding the record to the DB
    await Like.create({
      postId,
      likedBy: req.user?._id,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isLiked: true,
        },
        'Liked the Post successfully'
      )
    );
  }
});

module.exports = likeDislikePost;
