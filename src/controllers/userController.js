const AppError = require('../helpers/AppError')
const asyncError = require('../helpers/asyncError')
const User = require('../models/userModel')


exports.addRemoveFriend = asyncError(async (req, res, next) => {
    const userId = req.user._id.toString()
    const { friendId } = req.body
    if (userId === friendId) {
        return next(new AppError('Not accepted'))
    }

    const user = await User.findById(userId)
    const newFriend = await User.findById(friendId)
    console.log(newFriend)
})


exports.getUser = asyncError(async (req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id)

    if (!user) {
        return next(new AppError(`No user is found with this ${req.params.id}`, 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })

})

exports.getAllUsers = asyncError(async (req, res, next) => {

    const users = await User.find()
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    })


})

exports.updateUser = asyncError(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!user) {
        return next(new AppError('No user found with id', 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})


exports.deleteUser = asyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        return next(new AppError('No user found with id', 404))
    }

    res.status(200).json({
        status: "success",
        data: null
    })
})

exports.getMe = asyncError(async (req, res, next) => {
    req.params.id = req.user.id
    console.log(req.user.id)

    next()
})

exports.deleteMe = asyncError(async (req, res, next) => {

    await User.findByIdAndDelete(req.user.id)
    res.status(200).json({
        status: "success",
        data: null
    })

})

exports.updateMe = asyncError(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Route not for updating password. Kindly visit the /updatePassword Route', 400))
    }

    const newUserUpdates = await User.findByIdAndUpdate(req.user.id, filterUpdates(req.body, 'name', 'photo', 'email'), {
        runValidators: true,
        new: true
    })


    res.status(200).json({
        status: "success",
        data: {
            newUserUpdates
        }
    })
})