const mongoose = require('mongoose')

const userSchema= new mongoose.Schema({
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
    },
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true    
    },
    roles:{
       Eployee:{
        type: String,
        default:"Employee",
    },
        Admin:String
    },
    avatar: {
        type: String,
        required: false    
    },
    refreshToken:[String]
}) 

module.exports= mongoose.model('User',userSchema)