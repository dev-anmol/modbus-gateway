const express = require('express');
const router = express.Router();
const controller = require('../controllers/addressmap.controller');



router.post('/device-profile/:id/mappings', controller.addAddressMappings);


module.exports = router;