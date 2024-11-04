const { Post } = require('../../models/post.models');
const { createPostSchema } = require('../../schemas/post.schemas');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const createPost = asyncHandler(async (req, res, next) => {
  // validate the request
  const parsedBody = createPostSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  const post = await Post.create({ ...parsedBody.data, author: req.user?._id });

  return res
    .status(201)
    .json(new ApiResponse(201, post, 'Post Created Successfully'));
});

module.exports = createPost;
