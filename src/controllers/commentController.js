const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const asyncError = require('../helpers/asyncError')
const AppError = require('../helpers/AppError')
const statusCode = require('http-status-codes')


exports.createComment = asyncError(async (req, res, next) => {

    const post = await Post.findById(req.params.id)
    if (!post) return next(new AppError('Post has been deleted', 404))
    const createdComment = await Comment.create({
        ...req.body,
        user: req.user._id,
        post: req.params.id,
    })

    post.comments.push(createdComment._id)
    post.save()

    res.status(statusCode.OK).json({
        message: 'Your comment has been sent',
        comment: createdComment
    })
})

exports.getAllPostComments = asyncError(async (req, res, next) => {
    const comments = await Comment.find({ post: req.params.postId }).populate('user').sort({ createdAt: -1 })

    if (!comments) return next(new AppError('No comments added yet', 404))
    res.status(200).json({
        message: "success",
        totalComments: comments.length,
        comments: comments
    })

})

exports.getOneComment = asyncError(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) return next(new AppError('Comment has been deleted', 404))
    res.status(201).json({
        comment: comment
    })

})

exports.editComment = asyncError(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) return next(new AppError("Can't get comment", 404))

    if (comment.user.toString() !== req.user._id.toString()) return next(new AppError("You can edit this comment.", 404))

    if (!req.body.text) {
        comment.text
        return res.status(201).json({
            message: "Post edited successfully",
            data: comment
        })
    }

    console.log("There's a text update.")
    comment.text = req.body.text
    comment.save()

    res.status(201).json({
        message: "Post edited successfully",
        data: comment
    })
})

exports.toggleLikeComment = asyncError(async (req, res, next) => {
    const currentUserId = req.user._id.toString()
    const comment = await Comment.findById(req.params.commentId)

    if (comment.likes.includes(currentUserId)) {
        comment.likes = comment.likes.filter(like => like !== currentUserId)
        await comment.save()
        return res.status(201).json({
            message: "Comment Unliked",
            comment
        })
    }

    comment.likes.push(currentUserId)
    await comment.save()

    res.status(201).json({
        message: "Comment liked",
        comment
    })
})

exports.deleteComment = asyncError(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    const post = await Post.findById(req.params.postId)

    if (post.comments.includes(req.params.commentId)) {

        post.comments = post.comments.filter(comment => comment !== req.params.commentId)
        await post.save()
    }

    if (!comment) {
        return next(new AppError('Comment has been deleted', 404))
    }

    if (comment.user.toString() !== req.user._id.toString()) {
        return next(new AppError("Can't delete comment.", 404))
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(201).json({
        message: "Comment deleted Successfully",
        comment: null
    })
})