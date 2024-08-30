const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const errorHandler = require('./src/controllers/errorController')
const cors = require('cors')
const passport = require('passport')
const LocalStrategy = require('passport-local')

// starting express
const app = express()
// enabling .env file
dotenv.config({ path: "././.env" })

// middlewares
app.use(express.json())


// cors
app.use(cors())
app.use('*', cors())



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