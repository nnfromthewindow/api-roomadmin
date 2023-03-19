const mongoose = require('mongoose')

const ledgerItemSchema= new mongoose.Schema({
    date:{
        type: Date,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true    
    },
    value: {
        type: Number,
        required: true    
    }  
}) 

module.exports= mongoose.model('LedgerItem',ledgerItemSchema)