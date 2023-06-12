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
    expenses: {
        type: String,
        required: true
    },
    income: {
        type: String,
        required: true   
    }  
}) 

module.exports= mongoose.model('LedgerItem',ledgerItemSchema)