const express = require('express')
const router = express.Router()
const roomsController = require('../controllers/roomsController')
const verifyJWT = require('../middleware/verifyJWT')
const ROLES = require('../config/roles')
const verifyRoles = require('../middleware/verifyRoles')


router.use(verifyJWT)
router.use(verifyRoles(ROLES.Manager,ROLES.Admin))

router.route('/')
    .get(roomsController.getRooms)
    .post(roomsController.createRoom)
    .delete(roomsController.deleteRoom)

module.exports = router