const express = require('express')
const router = express.Router()
const todosController = require('../controllers/todosCotroller')

router.route('/')
    .get(todosController.getTodos)
    .post(todosController.createTodo)
    .patch(todosController.updateTodo)
    .delete(todosController.deleteTodo)

module.exports = router