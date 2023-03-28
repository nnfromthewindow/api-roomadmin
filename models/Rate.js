const mongoose = require('mongoose')

const rateSchema= new mongoose.Schema({
   
    name:{
        type: String,
        required: true
    },
  
    valueDay: {
        type: Number,
        required: true    
    }  
}) 

module.exports= mongoose.model('Rate',rateSchema)