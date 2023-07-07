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

    const duplicateIdNumber = await Customer.findOne({idnumber}).collation({locale: 'en', strength:2}).lean().exec()



    if(!name||!lastname||!phone||!idnumber||!adress){
        return res.status(400).json({message:"Complete required fields"})
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

    const customer = await Customer.findById(id).exec()

    

    if(!customer){
        return res.status(400).json({message:`Customer with ID ${id} not found`})
    }

    if(!name||!lastname||!idnumber||!adress||!phone){
        return res.status(400).json({message:"All fields except email are required"})
    }

    const duplicateCustomer = await Customer.findOne({idnumber}).collation({locale: 'en', strength:2}).lean().exec()



    if(name.length>20){
        return res.status(400).json({message:"The name should have less than 20 characters"})
    }

    if(lastname.length>20){
        return res.status(400).json({message:"The lastname should have less than 20 characters"})
    }
    
    if(idnumber.length>30){
        return res.status(400).json({message:"The Id Number should have less than 30 characters"})
    }

    if(duplicateCustomer && duplicateCustomer.name!=name && duplicateCustomer.lastname!=lastname){
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