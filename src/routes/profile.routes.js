const getProfileByUsername = require('../controllers/profile/getProfileByUsername');

const router = require('express').Router();

// Public routes
router.route('/u/:username').get(getProfileByUsername);

// Private routes

// export router
module.exports = router;
