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

module.exports={
    getAllCustomers,
    createCustomer
}