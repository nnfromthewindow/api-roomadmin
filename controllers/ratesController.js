const Rate = require('../models/Rate')

const getRates = async(req,res)=>{

    const rates = await Rate.find().lean()

    if(!rates){
    return res.status(400).json({message:'No rates'})
    }

    return res.json(rates)
}

const createRate = async(req,res) =>{
    const {name,valueDay} = req.body

    if(!name||!valueDay){
        return res.status(400).json({message:'All fields are required'})
        }

    const rateObject = {
    name, valueDay
    }

    const rate = await Rate.create(rateObject)

    if(rate){
        res.status(201).json({message:'Rate Created'})
    }else{
    res.status(400).json({message:'Invalid rate data received'})
    }
}

const updateRate = async(req,res)=>{
    const {id,name,valueDay} = req.body

    if(!name||!valueDay){
    return res.status(400).json({message:'All fields are required'})
    }

    const rate = await Rate.findById(id).exec()

    if(!rate){
    return res.status(400).json({message:'Rate not found'})
    }

    rate.name = name
    rate.valueDay = valueDay

    await rate.save()

    res.json({message:`Rate ${rate.name} updated!`})
}

const deleteRate = async(req,res)=>{
    const {id} = req.body

    if(!id){
        return res.status(400).json({message:'Rate ID required'})
    }

    const rate = await Rate.findById(id).exec()

    if(!rate){
    return res.status(400).json({message:'Rate not found'})
    }

    const result = await rate.deleteOne()

    const reply = `Rate ${result.name} deleted`

    res.json(reply)

}

module.exports = {
    getRates,
    createRate,
    updateRate,
    deleteRate
}