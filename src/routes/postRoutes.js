const express = express()

const router = express.Router()

const { createPost, getPost, archievePost, deletePost, editPost } = require('../controllers/postController')

const { checkAuthenticated } = require('../controllers/authController')
router.use(checkAuthenticated)

router.route('/createPost').post(createPost)
router.route('/archievePost/:id').post(archievePost)
router.route('/editPost/:id:').post(editPost)
router.route('/deletePost/:id').post(deletePost)
router.route('/getPost/:id').post(getPost)
module.exports = router