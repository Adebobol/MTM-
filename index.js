const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')




const app = express()
dotenv.config({ path: "././.env" })


app.use(express.json())

mongoose.connect("mongodb://127.0.0.1/MTM", {}).then(() => console.log("Database Connected."))


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})