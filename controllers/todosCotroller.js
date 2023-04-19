const Todo = require('../models/Todo')
const User = require('../models/User')
const getTodos = async (req,res)=>{

    const todos = await Todo.find().lean()
    if (!todos?.length) {
        return res.status(400).json({ message: 'No todos' })
    }
    return res.json(todos)
}

const createTodo = async (req,res)=>{
   const {date,description,status,employee} = req.body

   if(!date||!description||!status||!employee){
    return res.status(400).json({message:"All fields are required"})
   }  
   const todoObject = {
    date, description, status, employee 
   }
   const todo = await Todo.create(todoObject)

   if (todo) { 
    res.status(201).json({ message: `New Todo created` })
    } else {
    res.status(400).json({ message: 'Invalid Todo data received' })
    }
}

const updateTodo = async (req,res)=>{
    const {id,date,description,status,employee} = req.body
    
    if(!date||!description||!status||!employee){
        return res.status(400).json({message:"All fields are required"})
    }

    const todo = await Todo.findById(id).exec()

    if(!todo){
        return res.status(400).json({message:"Todo not found"})
    }

    todo.date = date
    todo.description = description
    todo.status = status
    todo.employee = employee

    await todo.save()

    res.json({message:`Todo with ID ${id} updated!`})
}

const deleteTodo = async(req,res)=>{
    const {id} = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const todo = await Todo.findById(id).exec()

    if(!todo){
        return res.status(400).json({message:`Todo with ID ${id} not found`})
    }
    
    const result = await todo.deleteOne()

    const reply = `Todo with ID ${result.id} deleted`

    res.json(reply)
}

const getEmployeeTodo = async(req,res)=>{
  
    const employee = await User.findOne({username:req.user}).select('-password').exec()
    if(req.user == req.params.username){
        const todos = await Todo.find({employee}).exec()
    console.log(todos)
    res.json({todos})
    }else{
    res.sendStatus(403)
    }
}

const updateTodoStatus = async(req,res) =>{
    const {id,status} = req.body

    if(!status){
        return res.status(400).json({message:"Status is required"})
    }

    const todo = await Todo.findById(id).exec()

    if(!todo){
        return res.status(400).json({message:"Todo not found"})
    }

    todo.status = status
   
    await todo.save()

    res.json({message:`Todo with ID ${id} updated!`})

}

module.exports={
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    getEmployeeTodo,
    updateTodoStatus
}
