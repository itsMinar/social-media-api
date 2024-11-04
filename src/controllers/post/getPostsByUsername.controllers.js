const { Post } = require('../../models/post.models');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const getPostsByUsername = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username: username.toLowerCase() });
  // If no user is found, throw a 404 Not Found error
  if (!user) {
    const error = CustomError.notFound({
      message: 'User not found!',
      errors: ['No user found with the provided username'],
      hints: 'Please check the username and try again',
    });

    return next(error);
  }

  const posts = await Post.find({ author: user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, 'Posts Fetched Successfully'));
});

module.exports = getPostsByUsername;
