// routes/allocationRoutes.js
const express = require('express');
const router = express.Router();
const { getAllocation, updateAllocation } = require('../controllers/allocationController');

router.route('/').get(getAllocation).post(updateAllocation);

module.exports = router;