const registerUser = require('../controllers/auth/registerUser.controllers');

const router = require('express').Router();

// Unsecured routes
router.route('/register').post(registerUser);

// Secured routes

// export router
module.exports = router;
