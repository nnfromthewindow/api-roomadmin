const express = require('express')
const router = express.Router()
const ratesController = require('../controllers/ratesController')

router.route('/')
    .get(ratesController.getRates)
    .post(ratesController.createRate)
    .patch(ratesController.updateRate)
    .delete(ratesController.deleteRate)


module.exports = router