const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, 'User must provide a valid email.']
    },
    photo: {
        type: String
    },

    // passwordConfirm: {
    //     type: String,
    //     required: [true, 'Password not same'],
    //     validate: {
    //         validator: function (el) {
    //             el === this.password
    //         },
    //         message: 'Password not same'
    //     }
    // },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            message: "only {values} are required"
        },
        default: 'user'
    },
    friends: {
        type: Array,
        default: []
    }

}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
})

userSchema.methods.correctPassword = async function (userPassword, password) {
    return await bcrypt.compare(userPassword, password)
}


const User = mongoose.model('User', userSchema)

module.exports = User
