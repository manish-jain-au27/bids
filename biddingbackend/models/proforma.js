const mongoose = require('mongoose');
const Offer = require('./offer'); // Assuming you have an Offer model
const User = require('./User'); // Assuming you have a User model
const Company = require('./Company'); // Assuming you have a Company model
const Product = require('./product'); // Assuming you have a Product model

const proformaSchema = new mongoose.Schema({
  proformaNo: {
    type: String,
    required: true,
    unique: true,
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  companyName: String,
  registerAddress: {
    address: String,
    pincode: String,
  },
  gstNo: String,
  mobileNo: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  userAddress: String,
  userGstNo: String,
  userMobileNo: String,
  userState: String, // New field for user's state
  userShippingAddress: {
    address: String,
    pincode: String,
    state: String,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productWeight: Number, // Add product weight field
  count: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  noOfBags: {
    type: Number,
    required: true,
  },
  freight: Number,
  insurance: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
  amount: {
    type: Number,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  deliveryDays: Number, // Add deliveryDays field
  date: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to set default values and populate necessary fields
proformaSchema.pre('save', async function (next) {
  try {
    const offer = await Offer.findById(this.offer).populate('companyId');

    if (!offer) {
      throw new Error('Offer not found');
    }

    const company = await Company.findById(offer.companyId);

    if (!company) {
      throw new Error('Company not found');
    }

    const user = await User.findById(this.user);

    if (!user) {
      throw new Error('User not found');
    }

    const product = await Product.findById(this.product);

    if (!product) {
      throw new Error('Product not found');
    }

    this.companyName = company.companyName;
    this.registerAddress.address = company.registerAddress.address;
    this.registerAddress.pincode = company.registerAddress.pincode;
    this.gstNo = company.gstNo;
    this.mobileNo = company.mobileNo;

    this.userName = user.name;
    this.userAddress = user.address;
    this.userGstNo = user.gstNo;
    this.userMobileNo = user.mobileNo;
    this.userState = user.state;
    this.userShippingAddress.address = user.shippingAddress.address;
    this.userShippingAddress.pincode = user.shippingAddress.pincode;
    this.userShippingAddress.state = user.shippingAddress.state;
  
    this.productWeight = product.weight;

    // Generate proforma number
    const proformaCount = await mongoose.model('Proforma').countDocuments({ company: this.company });
    const companyShortName = company.shortName;
    this.proformaNo = `${companyShortName}${proformaCount + 1}`;

    next();
  } catch (error) {
    next(error);
  }
});

const Proforma = mongoose.model('Proforma', proformaSchema);

module.exports = Proforma;
