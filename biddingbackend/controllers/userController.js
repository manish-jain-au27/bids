const User = require('../models/User');
const Offer = require('../models/offer');
const Company = require('../models/Company');
const Product = require('../models/product');
const Notification = require('../utils/sendNotification');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const sendNotification = async (companyId, notification) => {
  // Implementation to send notification to the company
  // You can use any notification library or service here
  console.log(`Sending notification to company ${companyId}: ${notification.message}`);
  // Example: Send notification to the company using your notification mechanism
};

const generateToken = (userId, mobileNo) => {
  // Replace 'your-secret-key' with your actual secret key
  const token = jwt.sign({ userId, mobileNo }, 'yourSecretKey', { expiresIn: '1h' });
  return token;
};
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      gstNo,
      mobileNo,
      email,
      password,
      bankDetails,
      quality,
      registerAddress,
      shippingAddress,
      market,
      productDetails,
    } = req.body;

    const existingUser = await User.findOne({ mobileNo });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this mobile number already exists' });
    }

    if (!isValidMobileNoFormat(mobileNo)) {
      return res.status(400).json({ error: 'Invalid mobile number format' });
    }

    const newUser = new User({
      name,
      gstNo,
      mobileNo,
      email,
      password,
      bankDetails: {
        bankName: bankDetails.bankName,
        accountName: bankDetails.accountName,
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
        city: bankDetails.city,
      },
      quality,
      registerAddress,
      shippingAddress,
      market,
      productDetails: productDetails.map(({ count, monthlyBagRequirement }) => ({ count, monthlyBagRequirement })),
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};








// Example mobile number validation function (replace with your actual validation logic)
function isValidMobileNoFormat(mobileNo) {
  // Update the regular expression based on your expected format
  return /^[0-9]{10}$/.test(mobileNo);
}

exports.loginUser = async (req, res) => {
  try {
    const { mobileNo, password } = req.body;

    // Find the user by mobileNo
    const user = await User.findOne({ mobileNo });

    // If user doesn't exist or password doesn't match
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    // Generate a token using the helper function
    const token = generateToken(user._id, user.mobileNo);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getLiveOffersByAllCompanies = async (req, res) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }

    const tokenWithoutPrefix = token.replace('Bearer ', '');
    const decodedToken = jwt.verify(tokenWithoutPrefix, 'yourSecretKey');
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Get the counts registered by the user
    const userCounts = user.productDetails.map((product) => product.count);

    // Filter offers based on the counts registered by the user
    const liveOffers = await Offer.find({ status: 'Live', count: { $in: userCounts } });

    res.status(200).json({ liveOffers });
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




exports.getUserDetails = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization');

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }

    // Extract the token without 'Bearer ' prefix
    const tokenWithoutPrefix = token.replace('Bearer ', '');

    // Verify the token
    const decodedToken = jwt.verify(tokenWithoutPrefix, 'yourSecretKey');
    const userId = decodedToken.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Exclude sensitive information (like password) before sending the user details
    const { _id, name, address,pincode,state, gstNo, mobileNo, email,shippingAddress, bankDetails } = user;

    res.status(200).json({
      userId: _id,
      name,
      address,
      pincode,
      state,
      gstNo,
      mobileNo,
      email,
      bankDetails,
      shippingAddress,
    });
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

exports.placeBidOnOffer = async (req, res) => {
  try {
    const { offerId, rate, noOfBags } = req.body;

    // Extract the token from the Authorization header
    const token = req.header('Authorization');

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }

    // Extract the token without 'Bearer ' prefix
    const tokenWithoutPrefix = token.replace('Bearer ', '');

    // Verify the token
    const decodedToken = jwt.verify(tokenWithoutPrefix, 'yourSecretKey');
    const userId = decodedToken.userId;

    // Fetch user details using the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if the offer exists and is still live
    const offer = await Offer.findById(offerId).populate('companyId').populate('productId');

    if (!offer || offer.status !== 'Live') {
      return res.status(404).json({ error: 'Offer not found or no longer live' });
    }

    // Create a new bid object with user information
    const newBid = {
      user: {
        _id: user._id,
        name: user.name,
        state: user.shippingAddress.state, // Include state in user details
        shippingAddress: user.shippingAddress, // Include shippingAddress in user details
      },
      rate: rate,
      noOfBags: noOfBags,
      status: 'Pending', // Initial status for bids
      proformaStatus: 'Not Generated', // Default proformaStatus
      userDetails: {
        name: user.name,
        address: user.address,
        pincode: user.pincode,
        gstNo: user.gstNo,
        mobileNo: user.mobileNo,
        email: user.email,
        state: user.state,
        shippingAddress: user.shippingAddress,
        shippingState: user.shippingAddress.state,
      },
    };

    // Add the bid to the offer's bids array
    offer.bids.push(newBid);

    // Save the updated offer with the new bid
    await offer.save();

    res.status(201).json({ message: 'Bid placed successfully', offer, user, company: offer.companyId });
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



exports.getUserBids = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization');

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }

    // Extract the token without 'Bearer ' prefix
    const tokenWithoutPrefix = token.replace('Bearer ', '');

    // Verify the token
    const decodedToken = jwt.verify(tokenWithoutPrefix, 'yourSecretKey');
    const userId = decodedToken.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Fetch bids placed by the user with details, including all bid statuses
    const userBids = user.notifications.filter(notification => ['bidAccepted', 'bidRejected'].includes(notification.type));

    // If any bid is accepted, update the status
    userBids.forEach((bid) => {
      if (bid.status === 'Accepted') {
        bid.status = 'Bid Accepted';
      }
    });

    // Fetch offers with bids placed by the user
    const userOffersWithBids = await Offer.find({
      'bids.user': userId,
    }).populate('bids.user', 'name bids.rate bids.noOfBags'); // Populate bid details

    res.status(200).json({
      userBids,
      userOffersWithBids,
    });
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

exports.addToWishlist = async (req, res) => {
  try {
    let userId = req.user.id;

    if (!userId && req.user.userId) {
      userId = req.user.userId;
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in the token' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { companyId, count } = req.body;

    if (!companyId || count === undefined) {
      return res.status(400).json({ error: 'Both companyId and count are required in the request body' });
    }

    // Fetch the company and populate the products field
    const company = await Company.findById(companyId).populate('products');

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Ensure that company.products is an array before using some method
    const isProductInCompany = Array.isArray(company.products) && company.products.some(p => p.count === count);

    if (!isProductInCompany) {
      return res.status(404).json({ error: 'Product not found in the company' });
    }

    // Find the product in the company's products array
    const product = company.products.find(p => p.count === count);

    if (!product || !product._id) {
      return res.status(404).json({ error: 'Product not found in the company' });
    }

    // Ensure that user.wishlist is an array before using some method
    user.wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];

    // Check if the product is already in the user's wishlist
    const isProductInWishlist = user.wishlist.some(item => item.productId && item.productId.equals(product._id));

    if (isProductInWishlist) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    // Add the product to the user's wishlist with the count as a number
    user.wishlist.push({
      companyId: new ObjectId(company._id), // Ensure companyId is stored as ObjectId
      productId: product._id,
      count: count || '', // Keep count as a string, default to an empty string if it's falsy
      description: product.description, // Add other product details as needed
      companyName: company.name, // Add company name to the wishlist
      companyShortName: company.shortName, // Add company short name to the wishlist
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      product: {
        productId: product._id,
        companyId: new ObjectId(company._id), // Ensure companyId is stored as ObjectId
        count: count || '', // Convert count to a number, default to 0 if conversion fails
        description: product.description, // Add other product details as needed
        companyName: company.name, // Include company name in the response
        companyShortName: company.shortName, // Include company short name in the response
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    let userId = req.user.id;

    if (!userId && req.user.userId) {
      userId = req.user.userId;
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in the token' });
    }

    const user = await User.findById(userId).populate('wishlist.companyId wishlist.productId');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = user.wishlist || [];

    // Convert wishlist item IDs to ObjectId
    const productIds = wishlist.map(wish => new ObjectId(wish.productId));
    const companyIds = wishlist.map(wish => new ObjectId(wish.companyId));

    // Fetch detailed information about products in the wishlist
    const wishlistProducts = await Company.populate(wishlist, {
      path: 'companyId',
      select: '_id name shortName', // Include shortName in the selection
    });

    const wishlistOffers = await Offer.find({
      companyId: { $in: companyIds },
      count: { $in: wishlist.map(wish => wish.count) },
    });

    res.status(200).json({ wishlist: wishlistProducts, wishlistOffers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getWishlistProducts = async (req, res) => {
  try {
    let userId = req.user.id;

    if (!userId && req.user.userId) {
      userId = req.user.userId;
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in the token' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = user.wishlist || [];

    console.log('User Wishlist:', wishlist);

    // Fetch all products added by companies in the wishlist
    const wishlistProducts = await Company.aggregate([
      {
        $match: {
          _id: { $in: wishlist.map(wish => wish.companyId) },
        },
      },
      {
        $unwind: '$products',
      },
      {
        $match: {
          'products._id': { $in: wishlist.map(wish => mongoose.Types.ObjectId(wish.productId)) },
        },
      },
      {
        $project: {
          _id: '$products._id',
          name: '$products.name',
          description: '$products.description',
          companyId: '$_id', // Include companyId in the response
          count: '$products.count', // Include count in the response
        },
      },
    ]);

    console.log('Wishlist Products:', wishlistProducts);

    res.status(200).json({ wishlistProducts });
  } catch (error) {
    console.error('Error in getWishlistProducts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllProductsForUser = async (req, res) => {
  try {
    let userId = req.user.id;

    if (!userId && req.user.userId) {
      userId = req.user.userId;
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in the token' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch all products added by companies
    const allProducts = await Company.aggregate([
      {
        $unwind: '$products', // Assuming your field is named 'products'
      },
      {
        $lookup: {
          from: 'products', // Assuming your product model is named 'Product'
          localField: 'products',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $group: {
          _id: '$productDetails._id',
          productId: { $first: '$productDetails._id' },
          companyId: { $first: '$_id' },
          count: { $first: '$productDetails.count' },
          description: { $first: '$productDetails.description' },
          companyName: { $first: '$companyName' }, // Assuming your company field is named 'companyName'
          companyShortName: { $first: '$companyShortName' }, // Assuming your company short name field is named 'companyShortName'
        },
      },
    ]);

    console.log('All Products:', allProducts);

    res.status(200).json({ allProducts });
  } catch (error) {
    console.error('Error in getAllProductsForUser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.deleteWishlistItem = async (req, res) => {
  try {
    // Extract productId from the request parameters
    const { productId } = req.params;

    // Extract the token from the Authorization header
    const token = req.header('Authorization');

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }

    // Extract the token without 'Bearer ' prefix
    const tokenWithoutPrefix = token.replace('Bearer ', '');

    // Verify the token
    const decodedToken = jwt.verify(tokenWithoutPrefix, 'yourSecretKey');
    const userId = decodedToken.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Find and remove the wishlist item with the given productId
    user.wishlist = user.wishlist.filter(item => item.productId.toString() !== productId);

    // Save the updated user document
    await user.save();

    res.status(200).json({ success: true, message: 'Wishlist item deleted successfully' });
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