const User = require('../models/User')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res)=>{
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message: "No users found"})
    }

    res.json(users)
}
/*
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
*/
const createNewUser = async (req,res)=>{
    const {name,lastname,idNumber,adress,email,phone,username,password,avatar}=req.body

    if(!name||!lastname||!phone){
        return res.status(400).json({message:"Complete required fields"})
    }

    const duplicate = await User.findOne({username}).collation({locale: 'en', strength:2}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Duplicate username"})
    }
    const hashedPassword = await bcrypt.hash(password,15)

    const userObject = {name, lastname,idNumber,adress,email,phone,username,"password":hashedPassword,avatar}

    const user = await User.create(userObject)

    if (user) { 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }

}

const updateUser =  async (req,res)=>{
    const {id,name,lastname,idnumber,adress,email,phone,username,password,roles,avatar}=req.body
    
    if(!name||!lastname||!phone||!username||!password||!roles){
        return res.status(400).json({ message: 'fields with * are required' })
    }
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({username}).collation({locale: 'en', strength:2}).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.name=name
    user.lastname=lastname
    user.email=email
    user.idnumber =idnumber
    user.adress=adress
    user.avatar=avatar
    user.username=username
    user.password=password
    user.roles= roles

    
    if (password) {
        user.password = await bcrypt.hash(password, 15) // 
    }
   
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })

}

const deleteUser = async (req,res)=>{
    const{id}=req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message:"User not found"})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}


module.exports ={
    getAllUsers,
    //postAdmin,
    createNewUser,
    updateUser,
    deleteUser
}