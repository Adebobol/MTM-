const asyncError = require('../helpers/asyncError')
const AppError = require('../helpers/AppError')
const upload = require('../helpers/multer-config')
const cloudinary = require('cloudinary').v2
const sharp = require('sharp')
const Post = require('../models/postModel')


// cloudinary configuration
cloudinary.config({
    cloud_name: 'dpow0m09z',
    api_key: 739729412575541,
    api_secret: 'QMJCcnTKDqAjz0Quy6yZDBroZfo'

    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.uploadUserPhoto = upload.single('photo')

// 

exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next()

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    // sharp(req.file.buffer).resize(500, 500).toBuffer('jpeg').jpeg({ quality: 90 }).toFile(`src/public/img/${req.file.filename}`)

    next()
}

// user creating  a post
exports.createPost = asyncError(async (req, res, next,) => {
    // 'src\\public\\img\\user-66d6f6f6efca75b320a6359a - 1725557616736.jpeg'
    let photoUrl
    const result = await cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            console.log(err)
        }
    })
    photoUrl = result.secure_url

    // console.log(photoUrl, req.body)
    const newPost = await Post.create({
        createdBy: req.user._id,
        post: req.body.title,
        photo: photoUrl,
    })

    res.status(201).json({
        messahe: "success",
        data: {
            newPost
        }
    })

})

// reading posts of a user

exports.getMyPosts = asyncError(async (req, res, next) => {
    const userId = req.user._id
    if (!userId) return next()
    const userPosts = await Post.find({ createdBy: userId })

    if (!userPosts) {
        return next(new AppError('User has no post', 500))
    }

    console.log(userPosts)

    res.status(200).json({
        message: "success",
        data: {
            userPosts
        }
    })
})

exports.getOnePost = asyncError(async (req, res, next) => {
    const id = req.params.id

    const post = await Post.findById(id).populate("createdBy")
    if (!post) {
        return next(new AppError("No post found", 500))
    }

    res.status(200).json({
        message: "success",
        data: post
    })
})

exports.archievePost = asyncError(async (req, res, next) => {
    const { _id } = req.user
    console.log(_id)
})

exports.editPost = asyncError(async (req, res, next) => {
    const id = req.user._id
    const post = await Post.findById(req.params.id)

    if (id.toString() !== post.createdBy.toString()) {
        return next(new AppError("You don't have access to update this post", 500))
    }
    const updatedPost = await post.updateOne(req.body)
    console.log(updatedPost)
})

exports.deletePost = asyncError(async (req, res, next) => {
    const { _id } = req.user
    console.log(_id)
})

exports.toggleLikePost = asyncError(async (req, res, next) => {
    const currentUserId = req.user._id
    const postId = req.params.id
    const post = await Post.findById(postId)
    console.log(presentUser, postId)

    if (post.likes.includes(currentUserId)) {
        post.likes.filter(like => like !== currentUserId)
        await post.save()
        res.status(200).json({
            message: "Unliked",
            data: post.likes
        })
    }
    post.likes.push(currentUserId)
    await post.save()

    res.status(200).json({
        message: "liked",
        data: post.likes
    })
})