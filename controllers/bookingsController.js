const Booking = require('../models/Booking')


const getAllBookings = async (req,res)=>{
 
    const bookings = await Booking.find().lean()

    if(!bookings?.length){
        return res.status(400).json({message:"No bookings found"})
    }

    res.json(bookings)
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


module.exports= {
    getAllBookings,
    createBooking
}