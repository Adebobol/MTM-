const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/userModel')
const asyncError = require('./asyncError')
const AppError = require('./AppError')
const statusCodes = require('http-status-codes')


const passConfig = asyncError(async (req, res, next) => {
    // serializeUser
    passport.serializeUser((user, done) => {
        // console.log(user)
        done(null, user._id)
    })

    // De serializeUser
    passport.deserializeUser(async (_id, done) => {

        const user = await User.findById(_id)
        // console.log(user)
        done(null, user)

    })
    const authUser = async (username, password, done) => {
        const authenticated_user = await User.findOne({ username: username }).select('+password')

        if (!authenticated_user || !(await authenticated_user.correctPassword(password, authenticated_user.password))) {
            console.log("Inc")
            new AppError('jhh', 404)
        }

        return done(null, authenticated_user)
    }

    passport.use(new LocalStrategy(authUser))

})
module.exports = passConfig

