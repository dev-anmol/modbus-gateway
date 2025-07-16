const express = require('express');
const router = express.Router();
const controller = require('../controllers/addressmap.controller');



router.post('/:id', controller.addAddressMappings);


module.exports = router;