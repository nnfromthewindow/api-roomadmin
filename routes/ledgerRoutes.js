const express = require('express')
const router = express.Router()
const ledgerItemsController = require('../controllers/ledgerItemsController')
const verifyJWT = require('../middleware/verifyJWT')
const ROLES = require('../config/roles')
const verifyRoles = require('../middleware/verifyRoles')


router.use(verifyJWT)
router.use(verifyRoles(ROLES.Manager,ROLES.Admin))

router.route('/')
    .get(ledgerItemsController.getAllItems)
    .post(ledgerItemsController.createLedgerItem)
    .delete(ledgerItemsController.deleteLedgerItem)
    .patch(ledgerItemsController.updateLedgerItem)

router.route('/date')
    .get(ledgerItemsController.getFilteredItems)

module.exports = router