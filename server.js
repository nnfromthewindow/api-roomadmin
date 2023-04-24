require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require ('path')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnection')
const mongoose = require ('mongoose')
const PORT = process.env.PORT || 3500

connectDB()
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/auth', require('./routes/authRoutes'))
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'))

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/todos', require('./routes/todoRoutes'))
app.use('/bookings', require('./routes/bookingRoutes'))
app.use('/clients', require('./routes/clientRoutes'))
app.use('/ledger', require('./routes/ledgerRoutes'))
app.use('/rooms', require('./routes/roomRoutes'))
app.use('/rates', require('./routes/rateRoutes'))


app.all('*',(req,res)=>{
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err =>{
    console.log(err)
})