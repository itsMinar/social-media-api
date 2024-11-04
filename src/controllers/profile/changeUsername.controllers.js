const { asyncHandler } = require('../../utils/asyncHandler');
const { changeUsernameSchema } = require('../../schemas/user.schemas');
const CustomError = require('../../utils/Error');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');

const changeUsername = asyncHandler(async (req, res, next) => {
  // validate the request
  const parsedBody = changeUsernameSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  const user = await User.findById(req.user?._id).select(
    'firstName lastName email username gender'
  );

  // If no user is found, throw a 404 Not Found error
  if (!user) {
    const error = CustomError.notFound({
      message: 'User not found!',
      errors: ['Token is not valid'],
      hints: 'Please check the token and try again',
    });

    return next(error);
  }

  // Check if the new username matches the current user's username
  if (user.username === parsedBody.data.username) {
    // If the username is the same, simply return a success response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user },
          'Username is already set to the provided value'
        )
      );
  }

  // Check if the username is already in use by another user
  const existingUser = await User.findOne({
    username: parsedBody.data.username,
  });

  if (existingUser) {
    return next(
      CustomError.conflict({
        message: 'Resource Conflict',
        errors: ['Username is already in use'],
        hints: 'Please provide a unique username',
      })
    );
  }

  // Update the username and save changes
  user.username = parsedBody.data.username;
  await user.save();

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, 'Username Changed Successfully'));
});

module.exports = changeUsername;
