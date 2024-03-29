const mongoose = require('mongoose');
const Product = require('./product'); // Assuming you have a Product model

// Company Schema
const companySchema = new mongoose.Schema({
  companyName: String,
  shortName: String,
  registerAddress: {
    address: String,
    state: String, // Add state field for registerAddress
    pincode: String,
  },
  factoryAddress: {
    address: String,
    state: String, // Add state field for factoryAddress
    pincode: String,
  },
  gstNo: String,
  mobileNo: {
    type: String,
    unique: true,
    required: true,
  },
  accManagerName: String,
  accManagerNo: String,
  dispatchManagerName: String,
  dispatchManagerMobileNo: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  bankDetails: {
    accName: String,
    accNo: String,
    ifscCode: String,
    bankName: String,
    city: String,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  commission: {
    selectedOption: {
      type: String,
      enum: ['onBag', 'onTaxableAmount'],
      required: true,
    },
    onBag: {
      amount: {
        type: Number,
        default: null,
      },
    },
    onTaxableAmount: {
      percentage: {
        type: Number,
        default: null,
      },
    },
  },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
