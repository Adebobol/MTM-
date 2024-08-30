const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passConfig = require('../helpers/passportConfiguration')

const { signUp, login, checkAuthenticated, logOut, restrictTo } = require('../controllers/authController')

router.post('/', signUp)
router.get('/login', login)
passConfig()
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}))
router.use(checkAuthenticated)
// router.get(restrictTo('admin'))


// router.route('/').post(createUser).get(getAllUsers)
// router.route('/:id').get(getUser)






module.exports = router