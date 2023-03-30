const express = require('express')
const router = express.Router()
const roomsController = require('../controllers/roomsController')

router.route('/')
    .get(roomsController.getRooms)
    .post(roomsController.createRoom)
    .patch(roomsController.updateRoom)
    .delete(roomsController.deleteRoom)

module.exports = router