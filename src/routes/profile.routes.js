const changeUsername = require('../controllers/profile/changeUsername.controllers');
const getProfileByUsername = require('../controllers/profile/getProfileByUsername');

const { verifyJWT } = require('../middlewares/auth.middleware');

const router = require('express').Router();

// Public routes
router.route('/u/:username').get(getProfileByUsername);

// Private routes
router.route('/change-username').put(verifyJWT, changeUsername);

// export router
module.exports = router;
