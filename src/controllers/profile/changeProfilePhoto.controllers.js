const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const {
  uploadOnCloudinary,
  getCloudinaryId,
  deleteFromCloudinary,
} = require('../../utils/cloudinary');

const changeProfilePhoto = asyncHandler(async (req, res, next) => {
  const profilePhotoLocalPath = req.file?.path;

  if (!profilePhotoLocalPath) {
    const error = CustomError.badRequest({
      message: 'Profile photo is required',
      errors: ['No Profile photo was provided in the request.'],
      hints: 'Please upload a Profile photo and try again',
    });

    return next(error);
  }

  const user = await User.findById(req.user?._id).select(
    '-password -refreshToken'
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

  // upload profile photo to cloudinary
  const profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);

  if (!profilePhoto.url) {
    const error = CustomError.serverError({
      message: 'Error while uploading the Profile Photo',
      errors: ['An error occurred during the Profile Photo upload process.'],
    });

    return next(error);
  }

  // find the profile photo id from the user profile photo url
  const profilePhotoIdOfCloudinary = getCloudinaryId(user.profilePhoto);

  // Delete the previous profile photo from Cloudinary
  await deleteFromCloudinary(profilePhotoIdOfCloudinary);

  // save the new profile photo url
  user.profilePhoto = profilePhoto.url;
  await user.save();

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile Photo Changed Successfully'));
});

module.exports = changeProfilePhoto;
