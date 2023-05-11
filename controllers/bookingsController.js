const Booking = require('../models/Booking')
const Client = require ('../models/Client')

const getAllBookings = async (req,res)=>{
 
    const bookings = await Booking.find().lean()

    if(!bookings?.length){
        return res.status(400).json({message:"No bookings found"})
    }
    const bookingsList = await Promise.all(bookings.map(async (booking) => {
        return {...booking}
    }))

    res.json(bookingsList)
}

const createBooking = async (req,res) =>{
    const{income,outcome,room,pax,client,value,discount,totalValue,note}=req.body

    if(!income||!outcome||!room||!pax||!client||!value||!totalValue){
        return res.status(400).json({message:"All fields except notes are required"})
    }

    const bookingObject = {
        income,outcome,room,pax,client,value,discount,totalValue,note
    }

    const booking = await Booking.create(bookingObject)

    if(!booking){
        return res.status(400).json({message:"An error ocurred, try again"})
    }

    res.json(booking)
}

const updateBooking = async(req,res)=>{
    const{id,income,outcome,room,pax,client,value,discount,totalValue,note}=req.body

    if(!income||!outcome||!room||!pax||!client||!value||!totalValue){
        return res.status(400).json({message:"All fields except notes are required"})
    }

    const booking = await Booking.findById(id)

    if(!booking){
        return res.status(400).json({message:`Booking with ID ${id} not found`})
    }
    booking.income= income
    booking.outcome= outcome
    booking.room = room
    booking.pax= pax
    booking.client = client
    booking.value = value
    booking.discount = discount
    booking.totalValue
    booking.note = note

    const result = await booking.save()

    res.json(result)
}

const deleteBooking = async(req,res)=>{
    const{id}=req.body

    if (!id) {
        return res.status(400).json({ message: 'Booking ID required' })
    }

    const booking = await Booking.findById(id)

    if(!booking){
        return res.status(404).json({message:"Booking not found"})
    }
    const clientFound = await Client.findById(booking.client)
    
    if(!clientFound){
        return res.status(404).json({message:"Client not found"})
    }

    const result = await booking.deleteOne()

    const reply = `${clientFound.name} ${clientFound.lastname}'s booking with ID ${result._id} deleted`

    res.json(reply)
    
}


module.exports= {
    getAllBookings,
    createBooking,
    updateBooking,
    deleteBooking
}