const express = require('express');
const router = express.Router();
const controller = require('../controllers/device.controller');


router.get('/', controller.getAllDevices);
router.post('/', controller.addDevice);


module.exports = router;