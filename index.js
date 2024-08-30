const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const errorHandler = require('./src/controllers/errorController')
const cors = require('cors')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')

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

passport.use(new LocalStrategy(authUser))

authUser = (user, password, done) => {
    // if user is found in DB
    return done(null, currentUser)
    // If the user is found but password isn't correct
    return done(null, false)
    // If the user not found in DB
    return done(null, false)
}

// serializeUser
passport.serializeUser((userObj, done) => {
    done(null, userObj)
})

// De serializeUser
passport.serializeUser((userObj, done) => {
    done(null, userObj)
})
// routes


// routes
// mongoose database connection
mongoose.connect("mongodb://127.0.0.1/MTM", {}).then(() => console.log("Database Connected."))

// handling error
app.use(errorHandler)
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})