const express = require('express')
const router = express.Router()
const ledgerItemsController = require('../controllers/ledgerItemsController')

router.route('/')
    .get(ledgerItemsController.getAllItems)
    .post(ledgerItemsController.createLedgerItem)
    .delete(ledgerItemsController.deleteLedgerItem)
    .patch(ledgerItemsController.updateLedgerItem)

router.route('/date')
    .get(ledgerItemsController.getFilteredItems)

module.exports = router