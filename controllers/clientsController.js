const Client = require('../models/Client')

const getAllClients = async(req,res)=>{

    const clients = await Client.find().lean()

    if(!clients?.length){
        res.status(400).json({message:"No clients found"})
    }

    res.json(clients)
}

const createClient = async(req,res)=>{
    const{name,lastname,idnumber,adress,email,phone}=req.body

    if(!name||!lastname||!phone){
        return res.status(400).json({message:"Complete required fields"})
    }

   const clientObject={
        name,lastname,idnumber,adress,email,phone
    }

    const client = await Client.create(clientObject)

    if(!client){
        return res.status(404).json({message:"An error ocurred try again"})
    }

    res.status(201).json({message: `New client ${client.name} ${client.lastname} successfull created!`})

}

module.exports={
    getAllClients,
    createClient
}