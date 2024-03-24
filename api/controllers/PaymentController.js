const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Proforma = require('../models/proforma');
const Payment = require('../models/Payment');
const Company = require('../models/Company');

// Add payment details for a proforma
exports.addPaymentDetails = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization');

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }

    // Extract the token without 'Bearer ' prefix
    const tokenWithoutPrefix = token.replace('Bearer ', '');

    // Verify the token and extract the user ID
    const decodedToken = jwt.verify(tokenWithoutPrefix, 'yourSecretKey');
    const userId = decodedToken.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Extract proforma ID from the request parameters
    const { proformaId } = req.params;

    // Check if the proforma exists
    const proforma = await Proforma.findById(proformaId);
    if (!proforma) {
      return res.status(404).json({ error: 'Proforma not found' });
    }

    // Extract payment details from the request body
    const { transactionId } = req.body;

    // Create a new payment document
    const payment = new Payment({
      user: userId,
      proforma: proformaId,
      amount: proforma.amount,
      transactionId,
      status: 'success', // Update the status to 'success'
    });

    // Save the payment details to the database
    await payment.save();

    // Fetch updated payment details with populated user, proforma, and company fields
    const updatedPayment = await Payment.findById(payment._id)
      .populate('user', 'name email mobileNo')
      .populate('proforma')
      .populate('company');

    // Return the updated payment details
    res.status(201).json({ message: 'Payment details added successfully', payment: updatedPayment });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    } else {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

// Get payments for a company's proforma
exports.getPaymentsForCompany = async (req, res) => {
  try {
    // Extract the company ID from the token
    const companyId = req.company.id;

    // Extract the proforma ID from the request parameters
    const { proformaId } = req.params;

    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(401).json({ error: 'Company not found' });
    }

    // Fetch payment details for the company's proforma
    const proforma = await Proforma.findById(proformaId)
      .populate({
        path: 'payment',
        match: { company: companyId }, // Filter payments by company
        populate: { path: 'user', select: 'name email mobileNo' } // Populate user details
      });

    if (!proforma) {
      return res.status(404).json({ error: 'Proforma not found' });
    }

    res.status(200).json({ proforma });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
