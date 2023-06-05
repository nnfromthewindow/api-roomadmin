const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customersController')
const verifyJWT = require('../middleware/verifyJWT')
const ROLES = require('../config/roles')
const verifyRoles = require('../middleware/verifyRoles')


router.use(verifyJWT)
router.use(verifyRoles(ROLES.Admin))

router.route('/')
    .get(customerController.getAllCustomers)
    .post(customerController.createCustomer)
    .patch(customerController.updateCustomer)
    .delete(customerController.deleteCustomer)


module.exports = router