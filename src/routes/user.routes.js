const loginUser = require('../controllers/auth/loginUser.controllers');
const registerUser = require('../controllers/auth/registerUser.controllers');

const router = require('express').Router();

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Private routes

// export router
module.exports = router;
