const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboard.controller');

// GET /api/admin/stats
router.get('/stats', dashboardController.getStats);

module.exports = router;
