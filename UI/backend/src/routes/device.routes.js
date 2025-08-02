const express = require('express');
const router = express.Router();
const controller = require('../controllers/device.controller');


router.get('/', controller.getAllDevices);
router.get('/:Id', controller.getDeviceById);
router.post('/', controller.addDevice);
router.post('/:Id', controller.updateDevice);
router.delete('/:Id', controller.deleteDevice);



module.exports = router;