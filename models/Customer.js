const mongoose = require('mongoose')

const customerSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true    
    },
    idnumber: {
        type: Number,
        required: false    
    },
    adress: {
        type: String,
        required: false    
    },
    email: {
        type: String,
        required: false    
    },
    phone: {
        type: String,
        required: true    
    }
}) 

module.exports= mongoose.model('Customer',customerSchema)