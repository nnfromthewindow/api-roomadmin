const Booking = require('../models/Booking')
const Customer = require ('../models/Customer')

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
    const{checkin,checkout,room,passengers,customer,value,discount,totalValue,note}=req.body

    if(!checkin||!checkout||!room||!passengers||!customer||!value||!totalValue){
        return res.status(400).json({message:"All fields except notes are required"})
    }

    const bookingObject = {
        checkin,checkout,room,passengers,customer,value,discount,totalValue,note
    }

    const booking = await Booking.create(bookingObject)

    if(!booking){
        return res.status(400).json({message:"An error ocurred, try again"})
    }

    res.json(booking)
}

const updateBooking = async(req,res)=>{
    const{id,checkin,checkout,room,passengers,customer,value,discount,totalValue,note}=req.body

    if(!checkin||!checkout||!room||!passengers||!customer||!value||!totalValue){
        return res.status(400).json({message:"All fields except notes are required"})
    }

    const booking = await Booking.findById(id)

    if(!booking){
        return res.status(400).json({message:`Booking with ID ${id} not found`})
    }
    booking.checkin= checkin
    booking.checkout= checkout
    booking.room = room
    booking.passengers= passengers
    booking.customer = customer
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
    const customerFound = await Customer.findById(booking.customer)
    
    if(!customerFound){
        return res.status(404).json({message:"Customer not found"})
    }

    const result = await booking.deleteOne()

    const reply = `${customerFound.name} ${customerFound.lastname}'s booking with ID ${result._id} deleted`

    res.json(reply)
    
}


module.exports= {
    getAllBookings,
    createBooking,
    updateBooking,
    deleteBooking
}