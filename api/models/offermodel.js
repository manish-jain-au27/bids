const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
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
    enum: ['Live', 'Closed', 'OfferWithBids'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Middleware to check working hours and set default values based on count selection
offerSchema.pre('save', function (next) {
  const now = new Date();
  const workingStartTime = new Date(now);
  workingStartTime.setHours(9, 0, 0, 0); // 9 AM

  const workingEndTime = new Date(now);
  workingEndTime.setHours(19, 0, 0, 0); // 7 PM

  if (now < workingStartTime || now > workingEndTime) {
    const error = new Error('Offer creation is allowed only between 9 AM and 7 PM.');
    return next(error);
  }

  // Check if 'NA' is selected for count
  if (this.count === 0) {
    this.rate = 'NA';
    this.noOfBags = 0;
    this.deliveryDays = 0;
    this.time = 0;
  } else {
    // Set default time to even hours
    this.time = Math.ceil(this.time / 2) * 2;
  }

  next();
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
