const express = require('express');
const router = express.Router();
const controller = require('../controllers/addressmap.controller');



router.put('/:id', controller.saveOrUpdateMappings);
router.get('/:id', controller.getAddressMappings);
router.get('/', controller.getAllAddressMappings);
router.delete('/:id', controller.deleteAddressMapping);

module.exports = router;