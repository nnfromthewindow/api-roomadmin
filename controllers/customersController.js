const Customer = require('../models/Customer')

const getAllCustomers = async(req,res)=>{

    const customers = await Customer.find().lean()

    if(!customers?.length){
        res.status(400).json({message:"No customers found"})
    }

    const customersList = await Promise.all(customers.map(async (customer) => {
        return {...customer}
    }))

    res.json(customersList)
}

const createCustomer = async(req,res)=>{
    const{name,lastname,idnumber,adress,email,phone}=req.body

    if(!name||!lastname||!phone){
        return res.status(400).json({message:"Complete required fields"})
    }

   const customerObject={
        name,lastname,idnumber,adress,email,phone
    }

    const customer = await Customer.create(customerObject)

    if(!customer){
        return res.status(404).json({message:"An error ocurred try again"})
    }

    res.status(201).json({message: `New customer ${customer.name} ${customer.lastname} successfull created!`})

}

const updateCustomer = async(req,res) =>{
    const{id,name,lastname,idnumber,adress,email,phone} = req.body

    if(!name||!lastname||!idnumber||!adress||!phone){
        return res.status(400).json({message:"All fields except email are required"})
    }

    const customer = await Customer.findById(id)

    if(!customer){
        return res.status(400).json({message:`Customer with ID ${id} not found`})
    }

    customer.name = name
    customer.lastname = lastname
    customer.idnumber = idnumber
    customer.adress = adress
    customer.email = email
    customer.phone = phone

    const result = await customer.save()

    res.json(result)
}

const deleteCustomer = async(req,res)=>{
    const{id}=req.body

    if (!id) {
        return res.status(400).json({ message: 'Customer ID required' })
    }

    const customer = await Customer.findById(id)

    if(!customer){
        return res.status(404).json({message:"Customer not found"})
    }

    const result = await customer.deleteOne()

    const reply = `${customer.name} ${customer.lastname}'s customer with ID ${result._id} deleted`

    res.json(reply)
    
}

module.exports={
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
}