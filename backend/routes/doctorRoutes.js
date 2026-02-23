const express = require('express');
const { getDoctors } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);
router.get('/', getDoctors);

module.exports = router;
