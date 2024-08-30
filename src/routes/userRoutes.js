const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const { signUp, login } = require('../controllers/authController')

router.post('/', signUp)
router.post('/login', passport.authenticate('local', {
    // successRedirect: '/profile',
    failureRedirect: '/login',
}))
// router.post('/login', login)



module.exports = router