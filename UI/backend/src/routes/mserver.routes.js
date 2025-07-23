const express = require('express');
const router = express.Router();
const controller = require('../controllers/mserver.controller');



router.post('/', controller.createServer);
router.get('/', controller.getServerDetails);
router.get('/:id', controller.getServerById);
router.post('/:id', controller.updateServer);
router.delete('/:id', controller.deleteServerProfile);



module.exports = router;