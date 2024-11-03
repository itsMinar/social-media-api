const loginUser = require('../controllers/auth/loginUser.controllers');
const logoutUser = require('../controllers/auth/logoutUser.controllers');
const registerUser = require('../controllers/auth/registerUser.controllers');

const { verifyJWT } = require('../middlewares/auth.middleware');

const router = require('express').Router();

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Private routes
router.route('/logout').post(verifyJWT, logoutUser);

// export router
module.exports = router;
