const mongoose = require('mongoose')

const bookingSchema= new mongoose.Schema({
    income:{
        type: Date,
        required: true
    },
    outcome:{
        type: Date,
        required: true
    },
    room: {
        type: Number,
        required: true    
    },
    pax: {
        type: Number,
        required: true    
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'    
    },
    value: {
        type: Number,
        required: true    
    },
    discount: {
        type: Number,
        required: true    
    },
    totalValue: {
        type: Number,
        required: true    
    },
    note: {
        type: String,
        required: true    
    },
}) 

module.exports= mongoose.model('Booking',bookingSchema)