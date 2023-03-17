const Todo = require('../models/Todo')

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

module.exports={
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
}
