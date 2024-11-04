const { asyncHandler } = require('../../utils/asyncHandler');
const { updateProfileSchema } = require('../../schemas/user.schemas');
const CustomError = require('../../utils/Error');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');

const updateProfile = asyncHandler(async (req, res, next) => {
  // validate the request
  const parsedBody = updateProfileSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // find the user and update info
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { ...parsedBody.data } },
    { new: true }
  ).select('-password -refreshToken');

  // If no user is found, throw a 404 Not Found error
  if (!user) {
    const error = CustomError.notFound({
      message: 'User not found!',
      errors: ['Token is not valid'],
      hints: 'Please check the token and try again',
    });

    return next(error);
  }

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, 'Profile Updated Successfully'));
});

module.exports = updateProfile;
