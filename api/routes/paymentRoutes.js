const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController');
const authenticateToken = require('../middlewares/authenticateToken');

// Route to add payment details for a proforma
router.post('/proformas/:proformaId/payments', paymentController.addPaymentDetails);

// Route to get payments for a company's proforma
router.get('/getPaymentsForCompany/:proformaId', authenticateToken, paymentController.getPaymentsForCompany);

module.exports = router;
