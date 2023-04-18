const express = require('express')
const router = express.Router()
const ratesController = require('../controllers/ratesController')
const verifyJWT = require('../middleware/verifyJWT')
const ROLES = require('../config/roles')
const verifyRoles = require('../middleware/verifyRoles')


router.use(verifyJWT)
router.use(verifyRoles(ROLES.Admin))

router.route('/')
    .get(ratesController.getRates)
    .post(ratesController.createRate)
    .patch(ratesController.updateRate)
    .delete(ratesController.deleteRate)


module.exports = router