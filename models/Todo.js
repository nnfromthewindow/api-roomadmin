const mongoose = require('mongoose')

const todoSchema= new mongoose.Schema({
    date:{
        type: Date,
        required: true
    },
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    description: {
        type: String,
        required: true    
    },
    status: {
        type: String,
        default: 'PENDING'    
    }
}) 

module.exports= mongoose.model('Todo',todoSchema)