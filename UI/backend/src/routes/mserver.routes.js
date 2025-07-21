const express = require('express');
const router = express.Router();
const controller = require('../controllers/mserver.controller');



router.post('/', controller.createServer);
router.get('/', controller.getServerDetails)



module.exports = router;