const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');

router.get('/', controller.getAllProfiles);
router.post('/', controller.addProfile);


module.exports = router;