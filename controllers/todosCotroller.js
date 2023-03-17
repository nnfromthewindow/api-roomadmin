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

   
}
module.exports={
    getTodos
}
