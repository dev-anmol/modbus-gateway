const express = require('express');
const router = express.Router();


router.get('/', require('../controllers/addressmap.controller'));


module.exports = router;