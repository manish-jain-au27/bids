const Offer = require('../models/offer');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/authenticateToken'); // Import the authenticateToken middleware

const generateToken = (mobileNo, companyId) => {
  return jwt.sign({ mobileNo, companyId }, 'yourSecretKey', { expiresIn: '365d' });
};

exports.registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      shortName,
      registerAddress,
      factoryAddress,
      gstNo,
      mobileNo,
      email,
      password,
      bankDetails,
      commission,
      accManagerName,
      accManagerNo,
      dispatchManagerName,
      dispatchManagerMobileNo
    } = req.body;

    // Check if a company with the given mobile number already exists
    const existingCompany = await Company.findOne({ mobileNo });

    if (existingCompany) {
      return res.status(400).json({ error: 'Company with this mobile number already exists' });
    }

    // Check if selectedOption is provided and is valid
    if (!commission || !commission.selectedOption || !['onBag', 'onTaxableAmount'].includes(commission.selectedOption)) {
      return res.status(400).json({ error: 'Invalid commission selectedOption' });
    }

    // Create a new company
    const newCompany = new Company({
      companyName,
      shortName,
      registerAddress,
      factoryAddress,
      gstNo,
      mobileNo,
      email,
      password,
      bankDetails,
      commission,
      accManagerName,
      accManagerNo,
      dispatchManagerName,
      dispatchManagerMobileNo
    });

    const savedCompany = await newCompany.save();

    const token = generateToken(savedCompany.mobileNo, savedCompany._id);
    res.status(201).json({ company: savedCompany, token });
  } catch (error) {
    console.error(error);

    // Check if the error is due to a duplicate key (unique constraint violation)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate mobile number or email' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.loginCompany = async (req, res) => {
  try {
    const { mobileNo, password } = req.body;

    const company = await Company.findOne({ mobileNo });

    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    // Check the password (plaintext, not recommended in a real-world scenario)
    if (password === company.password) {
      const token = generateToken(company.mobileNo, company._id);
      res.json({ company, token });
    } else {
      res.status(401).json({ error: 'Invalid password.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    // Check if user is authenticated and if company ID is provided in the request parameters
    if (!req.company || !req.company.id || !req.company.mobileNo) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });
    }

    // Extract company ID from req.company
    const companyId = req.company.id;

    // Update company data
    const updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, { new: true });

    if (!updatedCompany) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    // Send response with updated company data
    res.json({ company: updatedCompany });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getCompany = async (req, res) => {
  try {
    // Check if req.company is not null
    if (req.company) {
      const company = await Company.findOne({ mobileNo: req.company.mobileNo }).exec();

      if (!company) {
        return res.status(404).json({ error: 'Company not found.' });
      }

      res.json(company);
    } else {
      return res.status(401).json({ error: 'Unauthorized access. User information missing.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.user;
    const deletedCompany = await Company.findByIdAndDelete(companyId);

    if (!deletedCompany) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    res.json(deletedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.logoutCompany = async (req, res) => {
  try {
    // For token-based authentication, you typically don't need to do anything on the server-side to log out.
    // Instead, you handle logout on the client-side by clearing the token from local storage or cookies.

    // If you want to provide a response indicating successful logout, you can send a message back to the client.
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};