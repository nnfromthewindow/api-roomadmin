const mongoose = require('mongoose')

const ledgerSchema= new mongoose.Schema({
    date:{
        type: Date,
        required: true
    },
    description:{
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true    
    },
    value: {
        type: String,
        required: true    
    }  
}) 

module.exports= mongoose.model('Ledger',ledgerSchema)