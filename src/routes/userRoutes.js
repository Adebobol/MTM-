const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passConfig = require('../helpers/passportConfiguration')

const { signUp, login, checkAuthenticated, logOut, restrictTo } = require('../controllers/authController')
const { getAllUsers, getUser, updatePassword, addRemoveFriend, getMe, deleteMe, updateMe, getUserFollowers, getSuggestedUsers } = require('../controllers/userController')



router.post('/', signUp)
router.get('/login', login)
passConfig()
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}))
router.use(checkAuthenticated)

router.route('/suggested-friends').get(getSuggestedUsers)
router.route('/add-friend').post(addRemoveFriend)
router.route('/followers/:id').get(getUserFollowers)
router.route('/:id').get(getUser)


// router.patch('/updatePassword', updatePassword)
// router.get('/me', getMe, getUser)
router.delete('/deleteMe', deleteMe)
router.patch('/updateMe', updateMe)
router.delete('/logout', logOut)

router.use(restrictTo('admin'))


router.route('/').get(getAllUsers)
// router.route('/:id').get(getUser)





module.exports = router