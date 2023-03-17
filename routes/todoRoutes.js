const express = require('express')
const router = express.Router()
const todosController = require('../controllers/todosCotroller')

router.route('/')
    .get(todosController.getTodos)

module.exports = router