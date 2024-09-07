const express = require('express')

const router = express.Router()

const { createPost, getOnePost, uploadUserPhoto, getMyPosts, resizeUserPhoto, toggleLikePost, archievePost, deletePost, editPost } = require('../controllers/postController')

const { checkAuthenticated } = require('../controllers/authController')
router.use(checkAuthenticated)

// router.route('/createPost').post(createPost)
router.post('/createPost', uploadUserPhoto, resizeUserPhoto, createPost)
router.route('/myPost').get(getMyPosts)
// router.route('/archievePost/:id').post(archievePost)
router.route('/:id').patch(editPost)
// router.route('/deletePost/:id').post(deletePost)
router.route('/:id').get(getOnePost).post(toggleLikePost)
module.exports = router