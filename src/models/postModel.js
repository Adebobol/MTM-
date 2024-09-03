const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Post must have a sender.']
    },
    post: {
        type: String,
        required: [true, 'A post must not be empty.']
    },
    photo: {
        type: String,
        default: ''
    },
    likes: {
        type: [String]
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    location: {
        type: String,
        default: ''
    }

})

const Post = mongoose.model('Post', postSchema)

module.exports = Post