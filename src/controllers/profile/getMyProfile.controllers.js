const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const { getUserProfile } = require('./helper');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await getUserProfile(req.user._id, req);

  return res
    .status(200)
    .json(new ApiResponse(200, profile, 'User profile fetched successfully'));
});

module.exports = getMyProfile;
