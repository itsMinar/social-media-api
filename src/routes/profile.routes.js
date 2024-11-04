const changeUsername = require('../controllers/profile/changeUsername.controllers');
const getProfileByUsername = require('../controllers/profile/getProfileByUsername');
const updateProfile = require('../controllers/profile/updateProfile.controllers');

const { verifyJWT } = require('../middlewares/auth.middleware');

const router = require('express').Router();

// Public routes
router.route('/u/:username').get(getProfileByUsername);

// make rest of the request protected
router.use(verifyJWT);

// Private routes
router.route('/change-username').patch(changeUsername);
router.route('/').patch(updateProfile);

// export router
module.exports = router;
