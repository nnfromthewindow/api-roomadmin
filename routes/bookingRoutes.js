const express = require('express')
const router = express.Router()
const bookingsController = require('../controllers/bookingsController')
const verifyJWT = require('../middleware/verifyJWT')
const ROLES = require('../config/roles')
const verifyRoles = require('../middleware/verifyRoles')


router.use(verifyJWT)
router.use(verifyRoles(ROLES.Manager,ROLES.Admin))

router.route('/')
    .get(bookingsController.getAllBookings)
    .post(bookingsController.createBooking)
    .patch(bookingsController.updateBooking)
    .delete(bookingsController.deleteBooking)


module.exports = router