const { User } = require('../../models/user.models');
const { loginUserSchema } = require('../../schemas/user.schemas');
const generateAccessAndRefreshTokens = require('../../services/generateTokens');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const loginUser = asyncHandler(async (req, res, next) => {
  // validate the request
  const parsedBody = loginUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // Find the user by username or email
  const user = await User.findOne({
    $or: [
      { username: parsedBody.data.identifier },
      { email: parsedBody.data.identifier },
    ],
  });

  // If no user is found, throw a 404 Not Found error
  if (!user) {
    const error = CustomError.notFound({
      message: 'User not found!',
      errors: ['No user found with the provided email or username'],
      hints: 'Please check the email or username and try again',
    });

    return next(error);
  }

  // Validate the provided password against the stored password
  const isPasswordValid = await user.isPasswordCorrect(
    parsedBody.data.password
  );

  // If password is incorrect, throw a 401 Unauthorized error
  if (!isPasswordValid) {
    const error = CustomError.unauthorized({
      message: 'Invalid user credentials',
      errors: ['The provided password is incorrect.'],
      hints: 'Please check your credentials and try again',
    });

    return next(error);
  }

  // Generate access and refresh tokens for the user
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // Fetch the updated user information
  const loggedInUser = await User.findById(user._id).select(
    'firstName lastName email username gender'
  );

  // create options for security that it can only changeable from server
  const options = {
    httpOnly: true,
    secure: true, //TODO: will add the NODE_ENV condition
  };

  // return a Response
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User Logged In Successfully.'
      )
    );
});

module.exports = loginUser;
