const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/userModel')
const asyncError = require('./asyncError')
const AppError = require('./AppError')

const passConfig = asyncError(async (req, res, next) => {
    const authUser = async (username, password, done) => {
        const authenticated_user = await User.findOne({ username: username }).select('+password')

        if (!authenticated_user || !(await authenticated_user.correctPassword(password, authenticated_user.password))) {
            // return new AppError('Invalid username or password', 401)
            return console.log("Inc")
        }

        return done(null, authenticated_user)
    }
    passport.use(new LocalStrategy(authUser))

    // serializeUser
    passport.serializeUser((user, done) => {

        done(null, user)
    })

    // De serializeUser
    passport.deserializeUser((user, done) => {

        done(null, user)
    })

})
module.exports = passConfig

