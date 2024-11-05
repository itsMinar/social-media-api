const followUnFollowUser = require('../controllers/follow/followUnFollowUser.controllers');
const getFollowersListByUserName = require('../controllers/follow/getFollowersListByUserName.controllers');
const getFollowingListByUserName = require('../controllers/follow/getFollowingListByUserName.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');
const { validateMongoId } = require('../middlewares/validate.middleware');

const router = require('express').Router();

// Public routes
router.route('/list/followers/:username').get(getFollowersListByUserName);
router.route('/list/following/:username').get(getFollowingListByUserName);

// make rest of the request protected
router.use(verifyJWT);

// Private routes
router
  .route('/:toBeFollowedUserId')
  .post(validateMongoId('toBeFollowedUserId'), followUnFollowUser);

// export router
module.exports = router;
