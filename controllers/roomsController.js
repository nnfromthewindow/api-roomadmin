const Room = require('../models/Room')

const getRooms = async(req,res)=>{

    const rooms = await Room.find().lean()
    if(!rooms?.length){
        return res.status(400).json({message:"No rooms"})
    }
    const roomsList = await Promise.all(rooms.map(async (room) => {
        return {...room}
    }))

    res.json(roomsList)
}

const createRoom = async(req,res)=>{
    const{number,passengers,rooms,rate}=req.body

    if(!number||!passengers||!rooms||!rate){
        return res.status(400).json({message:"All fields are required"})
    }

    const roomObject = {
        number,
        passengers,
        rooms,
        rate
    }

    const room = await Room.create(roomObject)

    if(room){
    res.status(201).json({message:'Room created!'})
    }else{
    res.status(400).json({message:'Invalid Room data'})
    }

}

const updateRoom = async(req,res)=>{
    const{id,number,passengers,rooms,rate}=req.body

    if(!number||!passengers||!rooms||!rate){
        return res.status(400).json({message:'All fields are required'})
    }

    const room = await Room.findById(id).exec()

    if(!room){
    return res.status(400).json({message: 'No room found'})
    }

    room.number = number
    room.passengers = passengers
    room.rooms = rooms
    room.rate = rate

    await room.save()

    res.json({message:`Room n°${number} updated!`})
}

const deleteRoom = async(req,res) =>{
    const{id}=req.body

    if(!id){
        return res.status(400).json({ message: 'User ID Required' })
    }

    const room = await Room.findById(id).exec()

    if(!room){
    return res.status(400).json({message:`Room with ID ${id} not found`})}

    const result = await room.deleteOne()

    const reply = `Room n°${result.number} deleted`

    res.json(reply)
}

module.exports={
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom
}
