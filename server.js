require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require ('path')
const cors = require('cors')
const mongoose = require ('mongoose')
const connectDB = require('./config/dbConnection')
const PORT = process.env.PORT || 3500

connectDB()

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err =>{
    console.log(err)
})