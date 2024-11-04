const { asyncHandler } = require('../../utils/asyncHandler');

const getPostsByUsername = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ message: 'ok good...' });
});

module.exports = getPostsByUsername;
