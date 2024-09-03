const asyncError = require('../helpers/asyncError')
const AppError = require('../helpers/AppError')


exports.createPost = asyncError(async (req, res, next) => {
    const { _id } = req.user
    console.log(_id)
})

exports.getPost = asyncError(async (req, res, next) => {
    const { _id } = req.user
    console.log(_id)
})

exports.archievePost = asyncError(async (req, res, next) => {
    const { _id } = req.user
    console.log(_id)
})

exports.editPost = asyncError(async (req, res, next) => {
    const { _id } = req.user
    console.log(_id)
})

exports.deletePost = asyncError(async (req, res, next) => {
    const { _id } = req.user
    console.log(_id)
})