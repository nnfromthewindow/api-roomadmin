const LedgerItem = require('../models/LedgerItem')

const getAllItems = async(req,res)=>{

    const ledgerItems = await LedgerItem.find().lean()

    if(!ledgerItems?.length){
        return res.status(400).json({message:"No items found"})
    }

    res.json(ledgerItems)
}

const createLedgerItem = async(req,res)=>{
    
    const{date,description,type,value}=req.body

    if(!date||!description||!type||!value){
        return res.status(400).json({message:"All fields are required"})
    }

    const itemObject = {
        date,description,type,value
    }

    const ledgerItem = await LedgerItem.create(itemObject)

    if(!ledgerItem){
        return res.status(400).json({message:"Invalid data recieved"})
    }

    res.status(201).json({message:"New item created!"})
}

module.exports = {
    getAllItems,
    createLedgerItem
}