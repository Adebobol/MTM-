const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const errorHandler = require('./src/controllers/errorController')
const cors = require('cors')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const User = require('./src/models/userModel')
const userRouter = require('./src/routes/userRoutes')
// const asyncError=require('./')
// starting express
const app = express()
// enabling .env file
dotenv.config({ path: "././.env" })

// middlewares
app.use(express.json())


// cors
app.use(cors())
app.use('*', cors())

// initializing passport middleware
//1) express-session creates a req.session object, when it is involked via app.use(session())
// 2) passport adds additional object req.session.passport to the req.session
// 3) The serializeuser() grabs the authenticated user from the LocalStrategy and attaches it to the req.session.passport.user.{...}

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize())

app.use(passport.session())

const authUser = async (username, password, done) => {
    const authenticated_user = await User.findOne({ username: username }).select('+password')
    return done(null, authenticated_user)
}
passport.use(new LocalStrategy(authUser))

// serializeUser
passport.serializeUser((user, done) => {

    done(null, user._id)
})

// De serializeUser
passport.deserializeUser((_id, done) => {

    done(null, { user: _id })
})

bd = (req, res, next) => {
    console.log(req.session)
    console.log(req.session.passport)
    next()
}
app.use(bd)
// routes
app.use('/api/mtm/user', userRouter)

// routes
// mongoose database connection
mongoose.connect("mongodb://127.0.0.1/MTM", {}).then(() => console.log("Database Connected."))

// handling error
app.use(errorHandler)
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})