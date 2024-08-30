const devError = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }

    return res.status(err.statusCode).json({
        title: 'somethomg went wrong',
        msg: err.message
    })
}

const prodError = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }

        return res.status(err.statusCode).json({
            title: 'error',
            message: "Something went wrong"
        })
    }
}

module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        devError(err, req, res)
    } else if (process.env.NODE_ENV === 'production') {
        prodError(error, req, res)
    }
}