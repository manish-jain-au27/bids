const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gstNo: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNo: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  bankDetails: {
    bankName: String,
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    city: String,
  },
  quality: String,

  registerAddress: {
    address: String,
    pincode: String,
    state: {
      type: String,
      required: true,
      enum: ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'],
    },
  },
  shippingAddress: {
    address: String,
    pincode: String,
    state: {
      type: String,
      required: true,
      enum: ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'],
    },
  },
  market: {
    type: String,
    enum: ['domestic', 'international'],
    default: 'domestic',
    required: true,
  },
  notifications: [
    {
      type: {
        type: String,
        enum: ['bidAccepted', 'bidRejected'],
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  wishlist: [
    {
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      count: String,
      description: String,
      // Add other fields as needed
    },
  ],
  productDetails: [
    {
      count: {
        type: String,
        required: true,
      },
      monthlyBagRequirement: {
        type: Number,
        required: true,
      },
    }
  ],
});

userSchema.pre('save', function (next) {
  // No password hashing logic here, as per your request
  next();
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
