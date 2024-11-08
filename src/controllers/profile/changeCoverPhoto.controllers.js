const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');
const { User } = require('../../models/user.models');
const { ApiResponse } = require('../../utils/ApiResponse');
const {
  uploadOnCloudinary,
  getCloudinaryId,
  deleteFromCloudinary,
} = require('../../utils/cloudinary');

const changeCoverPhoto = asyncHandler(async (req, res, next) => {
  const coverPhotoLocalPath = req.file?.path;

  if (!coverPhotoLocalPath) {
    const error = CustomError.badRequest({
      message: 'Cover photo is required',
      errors: ['No Cover photo was provided in the request.'],
      hints: 'Please upload a Cover photo and try again',
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

  // upload cover photo to cloudinary
  const coverPhoto = await uploadOnCloudinary(coverPhotoLocalPath);

  if (!coverPhoto.url) {
    const error = CustomError.serverError({
      message: 'Error while uploading the Cover Photo',
      errors: ['An error occurred during the Cover Photo upload process.'],
    });

    return next(error);
  }

  // find the cover photo Id from the user cover photo url
  const coverPhotoIdOfCloudinary = getCloudinaryId(user.coverPhoto);

  // Delete the previous cover photo from Cloudinary
  await deleteFromCloudinary(coverPhotoIdOfCloudinary);

  // save the new cover photo url
  user.coverPhoto = coverPhoto.url;
  await user.save();

  // return a Response
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Cover Photo Changed Successfully'));
});

module.exports = changeCoverPhoto;
