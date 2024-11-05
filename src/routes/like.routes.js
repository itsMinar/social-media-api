const likeDislikeComment = require('../controllers/like/likeDislikeComment.controllers');
const likeDislikePost = require('../controllers/like/likeDislikePost.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');
const { validateMongoId } = require('../middlewares/validate.middleware');

const router = require('express').Router();

// Public routes

// make rest of the request protected
router.use(verifyJWT);

// Private routes
router.route('/post/:postId').post(validateMongoId('postId'), likeDislikePost);
router
  .route('/comment/:commentId')
  .post(validateMongoId('commentId'), likeDislikeComment);

// export router
module.exports = router;
