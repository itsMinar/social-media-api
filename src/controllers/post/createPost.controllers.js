const { asyncHandler } = require('../../utils/asyncHandler');

const createPost = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ message: 'ok good...' });
});

module.exports = createPost;
