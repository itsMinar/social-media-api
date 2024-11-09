const { Post } = require('../../models/post.models');
const { createPostSchema } = require('../../schemas/post.schemas');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { uploadOnCloudinary } = require('../../utils/cloudinary');
const CustomError = require('../../utils/Error');
const { postCommonAggregation } = require('./helper');

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

  // Map and upload photos concurrently
  const photosUploadPromises =
    req.files?.photos?.map((photo) =>
      uploadOnCloudinary(photo.path).then((response) => ({ url: response.url }))
    ) || [];

  // Wait for all uploads to complete
  let photos = [];
  try {
    photos = await Promise.all(photosUploadPromises);
  } catch (error) {
    return next(
      CustomError.serverError({
        message: 'Photos upload failed',
        errors: ['Something went wrong when uploading the photos to server'],
      })
    );
  }

  const post = await Post.create({
    ...parsedBody.data,
    photos,
    author: req.user?._id,
  });

  // check for post creation
  if (!post) {
    const error = CustomError.serverError({
      message: 'Something went wrong while creating the post',
      errors: ['An error occurred during the post creation process.'],
    });

    return next(error);
  }

  const createdPost = await Post.aggregate([
    {
      $match: {
        _id: post._id,
      },
    },
    ...postCommonAggregation(req.user._id),
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, createdPost[0], 'Post Created Successfully'));
});

module.exports = createPost;
