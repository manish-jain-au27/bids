const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  count: {
    type: String,
    required: [true, 'Count is required'],
  },
  rate: {
    type: String,
    default: 'NA',
  },
  noOfBags: {
    type: Number,
    default: 0,
  },
  deliveryDays: {
    type: Number,
    default: 0,
  },
  time: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'Live',
    enum: ['Live', 'Closed', 'OfferWithBids', 'Accepted'],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  weight: {
    type: String,
   requrie:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  bids: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rate: {
        type: String,
        required: true,
      },
      noOfBags: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'Rejected'],
      },
      userDetails: {
        name: {
          type: String,
          required: false, // Adjust as needed
        },
        address: {
          type: String,
          required: false, // Adjust as needed
        },
        pincode: {
          type: String,
          required: false, // Adjust as needed
        },
        gstNo: {
          type: String,
          required: false, // Adjust as needed
        },
        mobileNo: {
          type: String,
          required: false, // Adjust as needed
        },
        email: {
          type: String,
          required: false, // Adjust as needed
        },
      },
      proformaStatus: {
        type: String,
        default: 'Not Generated',
        enum: ['Not Generated', 'Generated'],
      },
    },
  ],
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
