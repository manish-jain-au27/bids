const Proforma = require('../models/proforma');
const Company = require('../models/Company');
const Offer = require('../models/offer');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/authenticateToken');

exports.createProforma = async (req, res) => {
  try {
    const { offerId, bidId, freight = 0, insurance = 0 } = req.body;

    // Check if the requester is authenticated as a company
    if (!req.company) {
      return res.status(401).json({ error: 'Unauthorized: Only a company can generate a proforma.' });
    }

    // Find the offer by ID and populate necessary fields
    const offer = await Offer.findById(offerId)
      .populate('companyId', 'companyName registerAddress pincode gstNo mobileNo')
      .populate({
        path: 'bids.user',
        select: 'name mobileNo address state gstNo shippingAddress',
      })
      .populate('productId', 'productName weight'); // Populate the productId with product details

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    // Find the accepted bid within the offer
    const acceptedBid = offer.bids.find(bid => bid._id.toString() === bidId && bid.status === 'Accepted');

    if (!acceptedBid) {
      return res.status(404).json({ error: 'Accepted bid not found in the offer.' });
    }

    // Access the userId from the accepted bid
    const userId = acceptedBid.user;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Calculate the amount based on the rate and noOfBags from the accepted bid
    const amount = parseFloat(acceptedBid.rate) * parseInt(acceptedBid.noOfBags) * parseFloat(offer.productId.weight);

    // Calculate CGST, SGST, or IGST based on the amount, freight, and insurance
    let cgst = 0, sgst = 0, igst = 0;

    // Check if both company and user states are available and equal
    if (offer.companyId.registerAddress.state && user.shippingAddress.state && offer.companyId.registerAddress.state === user.shippingAddress.state) {
      // Check if count is 'Cotton'
      if (offer.count.toLowerCase().includes('cotton')) {
        cgst = (amount + parseFloat(freight) + parseFloat(insurance)) * 2.5 / 100;
        sgst = cgst;
      } else {
        cgst = (amount + parseFloat(freight) + parseFloat(insurance)) * 6 / 100;
        sgst = cgst;
      }
    } else {
      // Check if count is 'Cotton'
      if (offer.count.toLowerCase().includes('cotton')) {
        igst = (amount + parseFloat(freight) + parseFloat(insurance)) * 5 / 100;
      } else {
        igst = (amount + parseFloat(freight) + parseFloat(insurance)) * 12 / 100;
      }
    }

    // Calculate the total amount including GST and round it off
    const totalAmount = Math.round(amount + parseFloat(freight) + parseFloat(insurance) + cgst + sgst + igst);

    // Generate a unique proforma number
    const companyData = await Company.findById(offer.companyId);
    if (!companyData) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    const proformaCount = await Proforma.countDocuments({ company: offer.companyId });
    const proformaNo = `${companyData.shortName}${proformaCount + 1}`;

    // Create a new Proforma document with rounded total amount
    const proforma = new Proforma({
      proformaNo,
      offer: offerId,
      company: offer.companyId,
      companyName: companyData.companyName,
      registerAddress: companyData.registerAddress, // Set as string
      gstNo: companyData.gstNo,
      mobileNo: companyData.mobileNo,
      user: userId, // Use the userId from the accepted bid
      userName: user.name,
      userAddress: user.address,
      userGstNo: user.gstNo,
      userMobileNo: user.mobileNo,
      userState: user.shippingAddress.state, // Add user state
      userShippingAddress: user.shippingAddress, // Add user shipping address
      product: offer.productId,
      productWeight: offer.productId.weight, // Add product weight
      deliveryDays: offer.deliveryDays,
      count: offer.count,
      rate: acceptedBid.rate,
      noOfBags: acceptedBid.noOfBags,
      freight: parseFloat(freight),
      insurance: parseFloat(insurance),
      cgst,
      sgst,
      igst,
      amount,
      total: totalAmount, // Use the rounded total amount
    });

    // Save the new Proforma document
    await proforma.save();

    // Update the proforma status for the bid to 'Generated'
    await Offer.findOneAndUpdate(
      { _id: offerId, 'bids._id': bidId },
      { $set: { 'bids.$.proformaStatus': 'Generated' } },
      { new: true }
    );

    console.log('Proforma created successfully');
    res.status(201).json({
      proforma,
      company: { companyName: companyData.companyName, registerAddress: companyData.registerAddress, pincode: companyData.registerAddress.pincode, gstNo: companyData.gstNo, mobileNo: companyData.mobileNo },
      user: { name: user.name, address: user.address, gstNo: user.gstNo, mobileNo: user.mobileNo, state: user.state, shippingAddress: user.shippingAddress },
      product: { weight: offer.productId.weight },
      deliveryDays: offer.deliveryDays,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};















exports.updateProforma = async (req, res) => {
  try {
    const { proformaId } = req.params;
    const { freight, insurance, cgst, sgst, igst, total } = req.body;

    const proforma = await Proforma.findByIdAndUpdate(
      proformaId,
      { freight, insurance, cgst, sgst, igst, total, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({ proforma });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteProforma = async (req, res) => {
  try {
    const { proformaId } = req.params;

    // Find and delete the proforma
    const proforma = await Proforma.findByIdAndDelete(proformaId);

    res.status(200).json({ proforma });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.sendProforma = async (req, res) => {
    try {
      const { proformaId } = req.params;
  
      // Find the proforma by ID
      const proforma = await Proforma.findById(proformaId);
  
      if (!proforma) {
        return res.status(404).json({ error: 'Proforma not found.' });
      }
  
      // Send the proforma as an email
      const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'your-email@example.com',
          pass: 'your-email-password',
        },
      });
  
      const mailOptions = {
        from: 'your-email@example.com',
        to: 'admin@example.com',
        subject: 'Proforma',
        text: `Proforma Details: \n\n${JSON.stringify(proforma, null, 2)}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Proforma sent successfully.' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.getProformaById = async (req, res) => {
    try {
      const { proformaId } = req.params;
  
      const proforma = await Proforma.findById(proformaId);
  
      if (!proforma) {
        return res.status(404).json({ error: 'Proforma not found.' });
      }
  
      res.status(200).json({ proforma });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getAllProformas = async (req, res) => {
    try {
      // Check if the requester is authenticated as a company
      if (!req.company) {
        return res.status(401).json({ error: 'Unauthorized: Company authentication information missing.' });
      }
  
      // Find all proformas associated with the company
      const proformas = await Proforma.find({ company: req.company.id });
  
      // Return the proformas
      res.status(200).json({ proformas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  