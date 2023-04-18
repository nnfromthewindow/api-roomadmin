const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientsController')
const verifyJWT = require('../middleware/verifyJWT')
const ROLES = require('../config/roles')
const verifyRoles = require('../middleware/verifyRoles')


router.use(verifyJWT)
router.use(verifyRoles(ROLES.Admin))

router.route('/')
    .get(clientController.getAllClients)
    .post(clientController.createClient)


module.exports = router