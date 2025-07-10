const express = require('express');
const router = express.Router();

router.get('/', require('../controllers/device.controller'));


module.exports = router;