const AppError = require('../helpers/AppError')
const asyncError = require('../helpers/asyncError')
const User = require('../models/userModel')

exports.signUp = asyncError(async (req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
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
    const { username, password } = req.body

    if (!username || !password) {
        return next(new AppError('Please provide email or password', 401))
    }

    const user = await User.findOne({ username }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect username or password', 401))
    }
    res.status(200).json({
        message: "success",
        data: {
            user
        }
    })
})