const express = require('express')
const router = express.Router()
const todosController = require('../controllers/todosCotroller')
const verifyJWT = require('../middleware/verifyJWT')
const ROLES = require('../config/roles')
const verifyRoles = require('../middleware/verifyRoles')


router.use(verifyJWT)
//router.use(verifyRoles(ROLES.Admin))
router.route('/')
    .get(todosController.getTodos)
    .post(todosController.createTodo)
    .patch(todosController.updateTodo)
    .delete(todosController.deleteTodo)

router.route('/:username')
    .get(todosController.getEmployeeTodo)

module.exports = router