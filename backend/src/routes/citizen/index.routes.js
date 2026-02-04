const express = require('express');
const router = express.Router();
const reportsController = require('../../controllers/citizen/reports.controller');

// POST /api/citizen/reports
router.post('/reports', reportsController.createReport);

module.exports = router;
