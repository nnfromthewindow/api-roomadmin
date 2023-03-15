const mongoose = require('mongoose')

const clientSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true    
    },
    id: {
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

module.exports= mongoose.model('Client',clientSchema)