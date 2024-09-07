const multer = require('multer')
const AppError = require('../helpers/AppError')

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'src/public/img')
    },
    filename: function (req, file, cb) {
        // const  = 'user - oi67tt890tpt - 89ro78t89r9.jpeg'
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${req.user.id
            } - ${Date.now()}.${ext}`)
    }
})

// const storage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false)
    }
}


// const upload = multer({ dest: 'src/public/img/users' })
const upload = multer({
    storage: storage,
    fileFilter: multerFilter
})

module.exports = upload