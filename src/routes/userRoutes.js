const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passConfig = require('../helpers/passportConfiguration')

const { signUp, login, checkAuthenticated, logOut, restrictTo } = require('../controllers/authController')
const { getAllUsers, getUser, updatePassword, getMe, deleteMe, updateMe } = require('../controllers/userController')



router.post('/', signUp)
router.get('/login', login)
passConfig()
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}))
router.use(checkAuthenticated)

// router.patch('/updatePassword', updatePassword)
router.get('/me', getMe, getUser)
router.delete('/deleteMe', deleteMe)
router.patch('/updateMe', updateMe)
router.delete('/logout', logOut)

router.use(restrictTo('admin'))


router.route('/').get(getAllUsers)
router.route('/:id').get(getUser)





module.exports = router