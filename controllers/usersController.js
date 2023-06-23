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

    const duplicate = await User.findOne({username}).collation({locale: 'en', strength:2}).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Duplicate username"})
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