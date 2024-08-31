const AppError = require('../helpers/AppError')
const asyncError = require('../helpers/asyncError')
const User = require('../models/userModel')

exports.signUp = asyncError(async (req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })
    if (!newUser) {
        return next(new AppError('Enter required fields', 404))
    }
    res.status(201).json({
        message: "success",
        data: {
            data: newUser
        }
    })

})


exports.login = asyncError(async (req, res, next) => {
    const user = req.user
    if (!user) {
        return next(new AppError("Inc username or password", 404))
    }
    console.log('Authentication successful')
    res.status(200).json({
        message: "success",
        data: {
            user
        }
    })
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You don't have access to perform this actiom", 403))
        }
        next()
    }
}


exports.checkAuthenticated = asyncError(async (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
})

exports.logOut = asyncError(async (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
    })
})
