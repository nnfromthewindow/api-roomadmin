const User = require('../models/User')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res)=>{
    const users = await User.find().lean()

    res.json(users)
}

const postAdmin = async (req,res)=>{
    const user = await User.create({
        name: "Nicolas",
        lastname: "Nuccelli",
        id: "2342325",
        adress: "San Martin 2342",
        email: "nuccelli@hotmail.com",
        phone: "1231231243",
        username: "nuccelli",
        password: "Nuccelli2023",
        roles: ["Admin"],
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    })
    res.status(201)
    return res.json()
}


module.exports ={
    getAllUsers,
    postAdmin
}