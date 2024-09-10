const express = require("express")
const path = require('path')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const errorHandler = require('./src/controllers/errorController')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const passConfig = require('./src/helpers/passportConfiguration')
const userRouter = require('./src/routes/userRoutes')
const postRouter = require('./src/routes/postRoutes')
const commentRouter = require('./src/routes/commentRoutes')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')


// starting express
const app = express()
// enabling .env file
dotenv.config({ path: "././.env" })

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '10kb' }));
app.use(helmet())
app.use(mongoSanitize())
// cors
app.use(cors())
app.use('*', cors())


// Limit request from same api
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many request from this Ip, please try again in an hour.'
})

app.use('/api', limiter)
// initializing passport middleware
//1) express-session creates a req.session object, when it is involked via app.use(session())
// 2) passport adds additional object req.session.passport to the req.session
// 3) The serializeuser() grabs the authenticated user from the LocalStrategy and attaches it to the req.session.passport.user.{...}

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1/MTM" }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}))

app.use(passport.initialize())

app.use(passport.session())


// bd = (req, res, next) => {
//     console.log(req.session)
//     console.log(req.session.passport)
//     next()
// }
// app.use(bd)
// routes
app.use('/api/mtm/user', userRouter)
app.use('/api/mtm/post', postRouter)
app.use('/api/mtm/comment', commentRouter)
// routes
// mongoose database connection
mongoose.connect("mongodb://127.0.0.1/MTM", {}).then(() => console.log("Database Connected."))

// handling error
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})