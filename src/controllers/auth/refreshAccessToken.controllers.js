const { User } = require('../../models/user.models');
const generateAccessAndRefreshTokens = require('../../services/generateTokens');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');
const jwt = require('jsonwebtoken');

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    const error = CustomError.unauthorized({
      message: 'Unauthorized request',
      errors: ['Refresh token is missing or invalid.'],
      hints: 'Please provide a valid refresh token and try again',
    });

    return next(error);
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      const error = CustomError.unauthorized({
        message: 'Invalid Refresh Token',
        errors: ['No user found with the provided refresh token.'],
        hints: 'Please check the refresh token and try again',
      });

      return next(error);
    }

    // check if incoming refresh token is same as the refresh token attached in the user document
    // This shows that the refresh token is used or not
    // Once it is used, we are replacing it with new refresh token below
    if (incomingRefreshToken !== user?.refreshToken) {
      const error = CustomError.unauthorized({
        message: 'Refresh Token is Expired or Used',
        errors: [
          'The provided refresh token is either expired or has already been used.',
        ],
        hints:
          'Please provide a valid refresh token or obtain a new one and try again',
      });

      return next(error);
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'Access token refreshed'
        )
      );
  } catch (err) {
    const error = CustomError.unauthorized({
      message: err?.message || 'Invalid Refresh Token',
      errors: [err?.message || 'The refresh token provided is invalid.'],
      hints: 'Please provide a valid refresh token and try again',
    });

    return next(error);
  }
});

module.exports = refreshAccessToken;
