const { asyncHandler } = require('../../utils/asyncHandler');
const { changePasswordSchema } = require('../../schemas/user.schemas');
const CustomError = require('../../utils/Error');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');

const changePassword = asyncHandler(async (req, res, next) => {
  // validate the request
  const parsedBody = changePasswordSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  const user = await User.findById(req.user?._id);

  // If no user is found, throw a 404 Not Found error
  if (!user) {
    const error = CustomError.notFound({
      message: 'User not found!',
      errors: ['Token is not valid'],
      hints: 'Please check the token and try again',
    });

    return next(error);
  }

  // Validate the provided password against the stored password
  const isPasswordValid = await user.isPasswordCorrect(
    parsedBody.data.oldPassword
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

  // update the password
  user.password = parsedBody.data.newPassword;
  await user.save({ validateBeforeSave: false });

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Password Changed Successfully'));
});

module.exports = changePassword;
