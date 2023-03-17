const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientsController')

router.route('/')
    .get(clientController.getAllClients)
    .post(clientController.createClient)


module.exports = router