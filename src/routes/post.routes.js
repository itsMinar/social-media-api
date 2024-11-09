const { MAXIMUM_POST_PHOTO_COUNT } = require('../constants');
const createPost = require('../controllers/post/createPost.controllers');
const deletePost = require('../controllers/post/deletePost.controllers');
const getAllPosts = require('../controllers/post/getAllPosts.controllers');
const getMyPosts = require('../controllers/post/getMyPosts.controllers');
const getPostById = require('../controllers/post/getPostById.controllers');
const getPostsByUsername = require('../controllers/post/getPostsByUsername.controllers');
const updatePost = require('../controllers/post/updatePost.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/multer.middleware');
const { validateMongoId } = require('../middlewares/validate.middleware');

const router = require('express').Router();

// Public routes
router.route('/').get(getAllPosts);
router.route('/:postId').get(validateMongoId('postId'), getPostById);
router.route('/get/u/:username').get(getPostsByUsername);

// make rest of the request protected
router.use(verifyJWT);

// Private routes
router
  .route('/')
  .post(
    upload.fields([{ name: 'photos', maxCount: MAXIMUM_POST_PHOTO_COUNT }]),
    createPost
  );
router.route('/get/my').get(getMyPosts);
router
  .route('/:postId')
  .patch(validateMongoId('postId'), updatePost)
  .delete(validateMongoId('postId'), deletePost);

// export router
module.exports = router;
