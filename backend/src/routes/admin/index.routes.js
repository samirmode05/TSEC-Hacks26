const express = require('express');
const router = express.Router();
const { getAllReports, updateReportStatus, getDashboardStats, getReportById } = require('../../controllers/admin/dashboard.controller');

// GET all reports (with user info)
router.get('/reports', getAllReports);

// GET report by ID
router.get('/reports/:id', getReportById);

// GET dashboard statistics
router.get('/stats', getDashboardStats);

// PATCH update report status
router.patch('/reports/:id', updateReportStatus);

module.exports = router;
