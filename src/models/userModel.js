const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password not same'],
        validate: {
            validator: function (el) {
                el === this.password
            },
            message: 'Password not same'
        }
    }

}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User
