const addComment = require('../controllers/comment/addComment.controllers');
const deleteComment = require('../controllers/comment/deleteComment.controllers');
const getPostComments = require('../controllers/comment/getPostComments.controllers');
const updateComment = require('../controllers/comment/updateComment.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');
const { validateMongoId } = require('../middlewares/validate.middleware');

const router = require('express').Router();

// Public routes
router.route('/post/:postId').get(validateMongoId('postId'), getPostComments);

// make rest of the request protected
router.use(verifyJWT);

// Private routes
router.route('/post/:postId').post(validateMongoId('postId'), addComment);
router
  .route('/:commentId')
  .patch(validateMongoId('commentId'), updateComment)
  .delete(validateMongoId('commentId'), deleteComment);

// export router
module.exports = router;
