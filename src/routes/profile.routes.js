const changeCoverPhoto = require('../controllers/profile/changeCoverPhoto.controllers');
const changeProfilePhoto = require('../controllers/profile/changeProfilePhoto.controllers');
const changeUsername = require('../controllers/profile/changeUsername.controllers');
const getProfileByUsername = require('../controllers/profile/getProfileByUsername');
const updateProfile = require('../controllers/profile/updateProfile.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/multer.middleware');

const router = require('express').Router();

// Public routes
router.route('/u/:username').get(getProfileByUsername);

// make rest of the request protected
router.use(verifyJWT);

// Private routes
router.route('/change-username').patch(changeUsername);
router.route('/').patch(updateProfile);
router
  .route('/profile-photo')
  .patch(upload.single('profilePhoto'), changeProfilePhoto);
router
  .route('/cover-photo')
  .patch(upload.single('coverPhoto'), changeCoverPhoto);

// export router
module.exports = router;
