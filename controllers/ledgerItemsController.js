const LedgerItem = require('../models/LedgerItem')

const getAllItems = async(req,res)=>{

    const ledgerItems = await LedgerItem.find().lean()

    if(!ledgerItems?.length){
        return res.status(400).json({message:"No items found"})
    }

    res.json(ledgerItems)
}

const getFilteredItems = async (req,res)=>{
    const {month, year}=req.body
  
    if(!month||!year){
        return res.status(400).json({message:"month and year required"})
    }

    if(month<1||month>12 || year<2023||year>3000 || month == 0){
        return res.status(400).json({message:"Invalid data"})
    }
    const ledgerItems = await LedgerItem.find().lean()
    
    if(!ledgerItems?.length){
        return res.status(400).json({message:"No items found"})
    }

    const filteredItems = ledgerItems.filter(item=> (item.date.getMonth()+1) === Number(month) && item.date.getFullYear()=== Number(year))

    if(!filteredItems?.length){
        return res.status(400).json({message:"No items found"})
    }

    res.json(filteredItems)
}

const createLedgerItem = async(req,res)=>{
    
    const{date,description,type,value}=req.body

    if(!date||!description||!type||!value){
        return res.status(400).json({message:"All fields required"})
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

const deleteLedgerItem = async (req,res)=>{
    const {id} = req.body

    if (!id) {
        return res.status(400).json({ message: 'Ledger item ID Required' })
    }

    const ledgerItem = await LedgerItem.findById(id).exec()

    if(!ledgerItem){
        return res.status(400).json({message:`Ledger item with ID ${id} not found`})
    }
    
    const result = await ledgerItem.deleteOne()

    const reply = `Ledger item with ID ${result.id} deleted`

    res.json(reply)
}

module.exports = {
    getAllItems,
    createLedgerItem,
    getFilteredItems,
    deleteLedgerItem
}