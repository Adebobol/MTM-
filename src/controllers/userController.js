const AppError = require('../helpers/AppError')
const asyncError = require('../helpers/asyncError')
const User = require('../models/userModel')


exports.addRemoveFriend = asyncError(async (req, res, next) => {
    const userId = req.user._id.toString()
    const { friendId } = req.body
    if (userId === friendId) {
        return next(new AppError('Not accepted'))
    }

    // Find both users
    const user = await User.findById(userId);
    const newFriend = await User.findById(friendId);

    if (!user || !newFriend) {
        return next(new AppError('User or friend not found', 404));
    }

    // Check if friendId is already in user's friends list
    const friendIndex = user.friends.indexOf(friendId);
    if (friendIndex !== -1) {
        // Remove friend from the list
        user.friends.splice(friendIndex, 1);
        await user.save(); // Save changes to the database

        return res.status(200).json({
            status: 'success',
            message: 'Friend removed successfully'
        });
    }

    // Add friend if not already in the list
    user.friends.push(friendId);
    await user.save(); // Save changes to the database

    return res.status(200).json({
        status: 'success',
        message: 'Friend added successfully'
    });
});

exports.getUserFollowers = asyncError(async (req, res, next) => {
    // getting user id from req.params
    const { id } = req.params

    // // searching User database for a user with id
    const user = await User.findById(id)

    const friends = await Promise.all(user.friends.map(frn => User.findById(frn)))

    const friendsDetails = friends.map(({ username }) => { return { username } })

    res.status(200).json({
        message: "success",
        followers: friendsDetails.length,
        data: {
            friendsDetails
        }
    })

})

exports.getUser = asyncError(async (req, res, next) => {
    const { id } = req.params

    const user = await User.findById(id)

    const friends = await Promise.all(user.friends.map(frn => User.findById(frn)))

    let friendsTotal = friends.length
    res.status(200).json({
        friends,
        friendsTotal,
        user
    })
})

exports.getSuggestedUsers = asyncError(async (req, res, next) => {
    const currentUser = req.user

    const users = await User.find()

    const currentUserFriendsIds = currentUser.friends.map(frn => frn)

    console.log(currentUserFriendsIds)

    let suggestedUsers = users.filter(user => !currentUserFriendsIds.includes(user._id.toString()) && user.username !== currentUser.username)
    suggestedUsers.sort((a, b) => {
        const aFriends = a.friends.filter(frn => currentUserFriendsIds.includes(frn._id.toString()))

        const bFriends = b.friends.filter(frn => currentUserFriendsIds.includes(frn._id.toString()))

        return bFriends.length - aFriends.length
    })
    suggestedUsers = suggestedUsers.slice(0, 2)
    res.status(200).json({
        data: suggestedUsers
    })
})

exports.getAllUsers = asyncError(async (req, res, next) => {

})


// exports.getUser = asyncError(async (req, res, next) => {
//     const id = req.params.id
//     const user = await User.findById(id)

//     if (!user) {
//         return next(new AppError(`No user is found with this ${req.params.id}`, 404))
//     }

//     res.status(200).json({
//         status: "success",
//         data: {
//             user
//         }
//     })

// })

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