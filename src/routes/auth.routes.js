const changePassword = require('../controllers/auth/changePassword.controllers');
const loginUser = require('../controllers/auth/loginUser.controllers');
const logoutUser = require('../controllers/auth/logoutUser.controllers');
const refreshAccessToken = require('../controllers/auth/refreshAccessToken.controllers');
const registerUser = require('../controllers/auth/registerUser.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = require('express').Router();

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);

// make rest of the request protected
router.use(verifyJWT);

// Private routes
router.route('/logout').post(logoutUser);
router.route('/change-password').post(changePassword);

// export router
module.exports = router;
