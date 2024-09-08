const express = require('express')

const router = express.Router()

const { createComment, getAllPostComments, getOneComment, editComment, toggleLikeComment, deleteComment, } = require('../controllers/commentController')

const { checkAuthenticated } = require('../controllers/authController')

router.use(checkAuthenticated)

router.get('/:postId', getAllPostComments)
router.get('/find/:commentId', getOneComment)
router.patch('/edit/:commentId', editComment)
router.delete('/delete/:postId/:commentId', deleteComment)
router.post('/like/:commentId', toggleLikeComment)
router.route('/:id').post(createComment)


module.exports = router