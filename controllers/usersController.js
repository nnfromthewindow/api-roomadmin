const User = require('../models/User')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res)=>{
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message: "No users found"})
    }

    const usersList = await Promise.all(users.map(async (user) => {
        return {...user}
    }))

    res.json(usersList)
}

const createNewUser = async (req,res)=>{
    const {name,lastname,idnumber,adress,email,phone,username,password,avatar,roles}=req.body
    
    if(!name||!lastname||!idnumber||!adress||!phone||!username||!password||!roles){
        return res.status(400).json({message:"Complete required fields"})
    }

    const duplicateUsername = await User.findOne({username}).collation({locale: 'en', strength:2}).lean().exec()

    if(duplicateUsername){
        return res.status(409).json({message: "Duplicate username"})
    }

    const duplicateIdNumber = await User.findOne({idnumber}).collation({locale: 'en', strength:2}).lean().exec()

    if(duplicateIdNumber){
        return res.status(409).json({message: "Duplicate Id Number"})
    }

    if(name.length>20){
        return res.status(400).json({message:"The name should have less than 20 characters"})
    }

    if(lastname.length>20){
        return res.status(400).json({message:"The lastname should have less than 20 characters"})
    }
    
    if(idnumber.length>30){
        return res.status(400).json({message:"The Id Number should have less than 30 characters"})
    }

    if(duplicateIdNumber){
        return res.status(409).json({message: "Duplicate customer"})
    }

    if(adress.length>50){
        return res.status(400).json({message:"The adress should have less than 50 characters"})
    }

    if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
        return res.status(400).json({message:"Invalid Email"})
    }

    if(email.length>30){
        return res.status(400).json({message:"The email should have less than 30 characters"})
    }

    if(phone.length>20){
        return res.status(400).json({message:"The phone number should have less than 20 characters"})
    }

    if(username.length>20 || username.length<4){
        return res.status(400).json({message:"The username should have a minimum of 4 characters and a maximum of 20 characters"})
    }

    if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/)){
        return res.status(400).json({message:"The password should contain at least one lowercase letter, one uppercase letter, one number, and have a minimum of 8 characters and a maximum of 20 characters"})
    }

    const hashedPassword = await bcrypt.hash(password,15)

    const userObject = {name, lastname, idnumber, adress, email, phone, username,"password":hashedPassword, avatar, roles}

    const user = await User.create(userObject)

    if (user) { 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }

}

const updateUser =  async (req,res)=>{
    const {id,name,lastname,idnumber,adress,email,phone,username,roles,avatar}=req.body
    
    if(!name||!lastname||!idnumber||!adress||!phone||!username||!roles){
        return res.status(400).json({ message: 'fields with * are required' })
    }
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    if(user.roles.includes('Admin')){
        return res.status(400).json({message:"You have no permission to edit an Admin"})
    }

    const duplicate = await User.findOne({username}).collation({locale: 'en', strength:2}).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.name = name
    user.lastname = lastname
    user.email = email
    user.idnumber = idnumber
    user.adress = adress
    user.phone = phone
    user.avatar = avatar
    user.username = username
    user.roles = roles

      
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

    if(user.roles.includes('Admin')){
        return res.status(400).json({message:"You have no permission to delete an Admin"})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}


module.exports ={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}