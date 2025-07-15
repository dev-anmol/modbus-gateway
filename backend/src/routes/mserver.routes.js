const express = require('express');
const router = express.Router();
const controller = require('../controllers/mserver.controller');



router.post('/', controller.createServer);



module.exports = router;