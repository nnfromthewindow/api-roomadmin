const mongoose = require('mongoose')

const roomSchema= new mongoose.Schema({
    number:{
        type: Number,
        required: true
    },
    pax:{
        type: Number,
        required: true
    },
    rooms: {
        type: Number,
        required: true    
    }
}) 

module.exports= mongoose.model('Room',roomSchema)