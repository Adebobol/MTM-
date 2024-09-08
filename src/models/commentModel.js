const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment