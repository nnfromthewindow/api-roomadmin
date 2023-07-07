const LedgerItem = require('../models/LedgerItem')

const getAllItems = async(req,res)=>{

    const ledgerItems = await LedgerItem.find().lean()

    if(!ledgerItems?.length){
        return res.status(400).json({message:"No items found"})
    }

    const ledgerItemsList = await Promise.all(ledgerItems.map(async (ledgerItem) => {
        return {...ledgerItem}
    }))

    res.json(ledgerItemsList)
}

/*

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
*/

const createLedgerItem = async(req,res)=>{
    
    const{date,description,expenses,income}=req.body

    if(!date||!description||!expenses||!income){
        return res.status(400).json({message:"All fields required"})
    }

    if(description.length>80){
        return res.status(400).json({message:"The description should have less than 80 characters"})
    }

    if(description.length>80){
        return res.status(400).json({message:"The value should have less than 20 numbers"})
    }
        
    const itemObject = {
        date,description,expenses,income
    }

    const ledgerItem = await LedgerItem.create(itemObject)

    if(!ledgerItem){
        return res.status(400).json({message:"Invalid data recieved"})
    }

    res.status(201).json({message:"New item created!"})
}

const updateLedgerItem = async(req,res)=>{
    const {id,date,description,expenses,income}= req.body

    const ledgerItem = await LedgerItem.findById(id).exec()

    ledgerItem.date = date
    ledgerItem.description = description
    ledgerItem.expenses = expenses
    ledgerItem.income = income

    if(!date||!description||!expenses||!income){
        return res.status(400).json({message:"All fields required"})
    }

    const newDate = new Date(date)

   if((newDate.getMonth()+1)<1||(newDate.getMonth()+1)>12 || newDate.getFullYear()<2023||newDate.getFullYear()>3000 || newDate.getMonth()+1 == 0){
    return res.status(400).json({message:"Invalid data"})
}
   
    const result = await ledgerItem.save()

    res.json({message:`Item with ID ${result.id} updated`})

}

const deleteLedgerItem = async (req,res)=>{
    const {ids} = req.body

    if (!ids) {
        return res.status(400).json({ message: 'Ledger items ID Required' })
    }

   
    const result = await LedgerItem.deleteMany({_id:ids})
    

    const reply = `Ledger items with IDs ${JSON.stringify(ids)} deleted`

    res.json(reply)
}

module.exports = {
    getAllItems,
    createLedgerItem,
    updateLedgerItem,
   // getFilteredItems,
    deleteLedgerItem
}