const express = require('express');
const router = express.Router();


router.get('/', require('../controllers/profile.controller'));
router.post('/', require('../controllers/profile.controller'));