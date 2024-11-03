const { User } = require('../models/user.models');
const CustomError = require('../utils/Error');

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    const formattedError = CustomError.serverError(err);

    CustomError.throwError(formattedError);
  }
};

module.exports = generateAccessAndRefreshTokens;
