const { asyncHandler } = require('../../utils/asyncHandler');

const getMyPosts = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ message: 'ok good...' });
});

module.exports = getMyPosts;
