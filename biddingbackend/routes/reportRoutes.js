const express = require('express');
const reportController = require('../controllers/reportController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

// Route to add a report
router.post('/add-report', authenticateToken, reportController.addReport);

// Route to get a report by ID
router.get('/get-report/:reportId', reportController.getReportById);

// Route to update a report
router.put('/update-report/:reportId', authenticateToken, reportController.updateReport);

// Route to get a report by count
router.get('/get-report-by-count/:count', reportController.getReportByCount);
router.delete('/delete-report/:reportId', authenticateToken, reportController.deleteReport); // New route for deleting a report

module.exports = router;
