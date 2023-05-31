const mongoose = require('mongoose')

const bookingSchema= new mongoose.Schema({
    checkin:{
        type: Date,
        required: true
    },
    checkout:{
        type: Date,
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Room'    
    },
    passengers: {
        type: Number,
        required: true    
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'    
    },
    value: {
        type: mongoose.Types.Decimal128,
        required: true    
    },
    discount: {
        type: Number,
        default: 0   
    },
    totalValue: {
        type: mongoose.Types.Decimal128,
        required: true    
    },
    note: {
        type: String,
        required: false    
    },
}) 

module.exports= mongoose.model('Booking',bookingSchema)