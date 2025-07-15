const express = require('express');
const router = express.Router();
const controller = require('../controllers/device.controller');


router.get('/', controller.getAllDevices);
router.get('/:Id', controller.getDeviceById);
router.post('/', controller.addDevice);



module.exports = router;