const Offer = require('../models/offer');

const Company = require('../models/Company');
const User = require('../models/User');
const Product = require('../models/product');
const sendNotification = require('../utils/sendNotification'); // Assuming you have a utility function to send notifications
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cron = require('node-cron');

const jwtSecret = 'yourSecretKey'; // Replace 'yourSecretKey' with your actual secret key

// Schedule a task to delete all offers every day at 7 PM
cron.schedule('0 19 * * *', async () => {
  try {
    // Delete all offers
    await Offer.deleteMany({});
    
    console.log('All offers deleted at 7 PM.');
  } catch (error) {
    console.error('Error deleting offers:', error);
  }
});

exports.createOffer = async (req, res) => {
  try {
    const { count, rate, noOfBags, deliveryDays, time } = req.body;

    if (!req.company) {
      return res.status(401).json({ error: 'Unauthorized: Company authentication information missing.' });
    }

    const companyId = req.company.id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    const product = await Product.findOne({ count });
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    const existingOffer = await Offer.findOne({ companyId, count, status: 'Live' });
    if (existingOffer) {
      return res.status(400).json({ error: 'Another live offer for the same count already exists.' });
    }

    const offer = new Offer({
      count,
      rate,
      noOfBags,
      deliveryDays,
      time,
      companyId: company._id,
      companyName: company.companyName,
      shortName: company.shortName,
      registerAddress: company.registerAddress.address,
      registerPincode: company.registerAddress.pincode,
      factoryAddress: company.factoryAddress.address,
      factoryPincode: company.factoryAddress.pincode,
      mobileNo: company.mobileNo,
      gstNo: company.gstNo,
      email: company.email,
      accManagerName: company.accManagerName,
      accManagerNo: company.accManagerNo,
      dispatchManagerName: company.dispatchManagerName,
      dispatchManagerMobileNo: company.dispatchManagerMobileNo,
      bankDetails: company.bankDetails,
      productId: product._id,
      productWeight: product.weight,
    });

    await offer.save();

    const populatedOffer = await Offer.findById(offer._id).populate('productId');

    console.log('Offer created:', populatedOffer);

    res.status(201).json({ offer: populatedOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};












exports.updateOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { rate, noOfBags, deliveryDays, time } = req.body;

    // Check if the current time is between 9 AM and 7 PM
    const currentTime = new Date().getHours();
    if (currentTime < 9 || currentTime >= 19) {
      return res.status(400).json({ error: 'Offer update is allowed only between 9 AM and 7 PM.' });
    }

    const offer = await Offer.findById(offerId);

    // Check if the offer exists
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Check if the offer is live
    if (offer.status !== 'Live') {
      return res.status(400).json({ error: 'Offer can only be updated while it is live.' });
    }

    // Update the offer with the new values
    offer.rate = rate;
    offer.noOfBags = noOfBags;
    offer.deliveryDays = deliveryDays;
    offer.time = time;
    offer.updatedAt = new Date();

    // Save the updated offer
    await offer.save();

    res.status(200).json({ offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    // Find and delete the offer
    const offer = await Offer.findByIdAndDelete(offerId);

    // If the offer was found and deleted successfully
    if (offer) {
      // Remove the offer from the associated company if it exists in the array
      await Company.updateOne(
        { offers: offerId }, // Assuming offers field is an array of offer IDs
        { $pull: { offers: offerId } }
      );

      res.status(200).json({ offer });
    } else {
      // If the offer was not found
      res.status(404).json({ error: 'Offer not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getLiveOffers = async (req, res) => {
  try {
    if (!req.company) {
      return res.status(401).json({ error: 'Unauthorized: Company authentication information missing.' });
    }

    const companyId = req.company.id;

    const liveOffers = await Offer.find({ 
      companyId, 
      status: 'Live',
    });

    const currentTime = new Date();
    console.log('Current Time:', currentTime.toISOString());
    for (const offer of liveOffers) {
      console.log('Offer Creation Time:', new Date(offer.createdAt).toISOString());
      const timeRemaining = offer.time - ((currentTime - new Date(offer.createdAt)) / (1000 * 60 * 60)); // Convert milliseconds to hours
      offer.timeRemaining = timeRemaining > 0 ? timeRemaining : 0; // Ensure time remaining is not negative
      console.log('Time Remaining for Offer:', offer.timeRemaining);
    }

    res.status(200).json({ liveOffers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






exports.withdrawOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    // Find and update the status of the offer to "Withdrawn"
    const offer = await Offer.findByIdAndUpdate(
      offerId,
      { status: 'Withdrawn', updatedAt: new Date() },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.status(200).json({ offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    res.status(200).json({ offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllOffers = async (req, res) => {
  try {
    // Check if the requester is authenticated as a company
    if (!req.company) {
      return res.status(401).json({ error: 'Unauthorized: Company authentication information missing.' });
    }

    const companyId = req.company.id; // Use companyId from the authenticated company's token

    const allOffers = await Offer.find({ companyId, status: { $nin: ['Withdrawn', 'Expired'] } });

    res.status(200).json({ offers: allOffers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getLiveOffersByCount = async (req, res) => {
  try {
    const { count } = req.params;

    // Retrieve live offers based on count
    const liveOffers = await Offer.find({ count, status: 'Live' });

    res.status(200).json({ liveOffers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOffersWithBids = async (req, res) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }

    const tokenWithoutPrefix = token.replace('Bearer ', '');

    // Verify the token and log the decoded token for troubleshooting
    const decodedToken = jwt.verify(tokenWithoutPrefix, 'yourSecretKey');
    console.log('Decoded Token:', decodedToken);

    if (decodedToken.companyId) {
      // Retrieve live offers with bids for the specific company
      let companyOffersWithBids = await Offer.find({
        companyId: decodedToken.companyId,
        status: { $in: ['Live', 'Closed'] },
        bids: {
          $exists: true,
          $not: { $size: 0 },
        },
      }).populate({
        path: 'bids',
        populate: {
          path: 'user',
          model: 'User',
          select: 'name mobileNo gstNo email state shippingAddress',
        },
      }).populate({
        path: 'companyId',
        model: 'Company',
      }).populate({
        path: 'productId',
        model: 'Product', // Populate the productId field with the Product model
        select: 'weight', // Select only the 'weight' field of the Product
      });

      // Filter out bids with status 'Accepted' and 'ProformaGenerated'
      companyOffersWithBids = companyOffersWithBids.map((offer) => {
        offer.bids = offer.bids.filter((bid) => bid.status !== 'Accepted' || bid.proformaStatus !== 'Generated');
        return offer;
      }).filter((offer) => {
        if (offer.noOfBags === 0) {
          const hasPendingBid = offer.bids.some((bid) => bid.status === 'Pending');
          return hasPendingBid;
        }
        return true;
      }); // Remove offers with no remaining bids and noOfBags equal to 0

      // Subtract noOfBags in offer from noOfBags in bid if proforma status is 'Generated'
      companyOffersWithBids.forEach((offer) => {
        offer.bids.forEach((bid) => {
          if (bid.proformaStatus === 'Generated') {
            bid.noOfBags -= offer.noOfBags;
          }
        });
      });

      // Format the response as needed
      const offersWithBidsAndUserBidIds = companyOffersWithBids.map((offer) => {
        const mappedOffer = {
          ...offer.toObject(),
          bids: offer.bids.map((bid) => {
            return {
              ...bid.toObject(),
              userId: bid.user ? bid.user._id : null, // Check if user is null or undefined
              bidId: bid._id,
              state: bid.user ? bid.user.state : null,
              shippingAddress: bid.user ? bid.user.shippingAddress : null,
            };
          }),
          company: offer.companyId, // Include the company details in the offer object
          product: offer.productId, // Include the populated product details
          weight: offer.productId ? offer.productId.weight : null, // Include the product weight
        };
        return mappedOffer;
      });

      console.log('Offers with Bids and User Bid Ids:', offersWithBidsAndUserBidIds);

      res.status(200).json({ offersWithBids: offersWithBidsAndUserBidIds });
    } else {
      return res.status(401).json({ error: 'Invalid token. CompanyId not found in the token.' });
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    } else {
      console.error('Error in getOffersWithBids:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};







exports.acceptBid = async (req, res) => {
  try {
    const { offerId, bidId } = req.params;

    // Check if the offer exists
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ error: `Offer with ID ${offerId} not found` });
    }

    // Check if the offer is still live
    if (offer.status !== 'Live') {
      return res.status(400).json({ error: `Offer with ID ${offerId} is no longer live` });
    }

    // Find the bid in the offer's bids array
    const acceptedBid = offer.bids.find(bid => bid._id.toString() === bidId);

    if (!acceptedBid) {
      return res.status(404).json({ error: `Bid with ID ${bidId} not found in the offer` });
    }

    // Check if the bid has already been rejected
    if (acceptedBid.status === 'Rejected') {
      return res.status(400).json({ error: `Bid with ID ${bidId} has already been rejected` });
    }

    // Check if the bid has already been accepted
    if (acceptedBid.status === 'Accepted') {
      return res.status(400).json({ error: `Bid with ID ${bidId} has already been accepted` });
    }

    // Check if the bid noOfBags is greater than noOfBags in the offer
    if (acceptedBid.noOfBags > offer.noOfBags) {
      return res.status(400).json({ error: `Bid with ID ${bidId} has more bags than available in the offer` });
    }

    // Update the status of the accepted bid to "Accepted"
    acceptedBid.status = 'Accepted';

    // Set the proformaGenerated flag to true for the accepted bid
    acceptedBid.proformaGenerated = true;

    // Reduce the noOfBags in the offer by the accepted bid noOfBags
    offer.noOfBags -= acceptedBid.noOfBags;

    // Save the updated offer with the accepted bid status and updated bags count
    await offer.save();

    // Check if the noOfBags is 0 after accepting the bid
    if (offer.noOfBags === 0) {
      // If noOfBags is 0, close the offer
      offer.status = 'Closed';
      await offer.save();
    }

    // Get the complete user details for the accepted bid
    const user = await User.findById(acceptedBid.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Include user details in the acceptedBid object
    acceptedBid.user = {
      _id: user._id,
      name: user.name,
      address: user.address,
      gstNo: user.gstNo,
      mobileNo: user.mobileNo,
      pincode: user.pincode,
      state: user.state,
      shippingAddress: user.shippingAddress,
    };

    console.log('Accepted Bid Details:', acceptedBid);

    res.status(200).json({ message: 'Bid accepted successfully', acceptedBid });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};









exports.rejectBid = async (req, res) => {
  try {
    const { offerId, bidId } = req.params;

    // Find the offer by ID
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    // Find the bid within the offer
    const bid = offer.bids.id(bidId);

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found.' });
    }

    // Check if the bid has already been accepted
    if (bid.status === 'Accepted') {
      return res.status(400).json({ error: `Bid with ID ${bidId} has already been accepted` });
    }

    // Check if the bid has already been rejected
    if (bid.status === 'Rejected') {
      return res.status(400).json({ error: `Bid with ID ${bidId} has already been rejected` });
    }

    // Update the bid status to 'Rejected'
    bid.status = 'Rejected';

    // Save the changes
    await offer.save();

    // Notify the user whose bid was rejected
    if (bid.user) {
      await sendNotification(bid.user, 'Bid Rejected', 'Your bid has been rejected.');
    }

    res.status(200).json({ offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.rejectAllBids = async (req, res) => {
  try {
    const { offerId } = req.params;

    // Find the offer by ID
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    // Iterate through all bids and reject only the bids with status 'Pending'
    offer.bids.forEach(async (bid) => {
      if (bid.status === 'Pending') {
        bid.status = 'Rejected';

        // Notify the user whose bid was rejected
        if (bid.user) {
          await sendNotification(bid.user, 'Bid Rejected', 'Your bid has been rejected.');
        }
      }
    });

    // Save the changes
    await offer.save();

    // Check if any bid is accepted
    const isAnyBidAccepted = offer.bids.some((bid) => bid.status === 'Accepted');

    // Check if Performa is generated
    const isPerformaGenerated = offer.performaGenerated;

    res.status(200).json({
      message: 'Pending bids rejected successfully.',
      isAnyBidAccepted,
      isPerformaGenerated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getAcceptedBid = async (req, res) => {
  try {
    const { offerId, bidId } = req.params;

    console.log('Fetching offer...');
    // Find the offer by ID and populate the product details
    const offer = await Offer.findById(offerId)
      .populate({
        path: 'productId',
        select: 'weight'
      })
      .populate({
        path: 'companyId',
        select: 'registerAddress state'
      });

    if (!offer) {
      console.log('Offer not found');
      return res.status(404).json({ error: 'Offer not found.' });
    }

    console.log('Offer found. Fetching accepted bid...');
    // Find the accepted bid within the offer
    const acceptedBid = offer.bids.find(bid => bid._id.toString() === bidId && bid.status === 'Accepted');

    if (!acceptedBid) {
      console.log('Accepted bid not found');
      return res.status(404).json({ error: 'Accepted bid not found.' });
    }

    console.log('Accepted bid found. Fetching user details...');
    // Get the complete user details for the accepted bid
    const user = await User.findById(acceptedBid.user._id).select('name mobileNo gstNo email state shippingAddress');

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found.' });
    }

    console.log('User found. Including user details in the response...');
    // Include user details in the acceptedBid object
    acceptedBid.user = user;

    console.log('Sending response...', acceptedBid);
    res.status(200).json({ offer, acceptedBid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAcceptedBidById = async (req, res) => {
  try {
    const { offerId, bidId } = req.params;

    // Find the offer by ID and populate the company details
    const offer = await Offer.findById(offerId).populate('companyId');

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    // Find the accepted bid with the specified bid ID
    const acceptedBid = offer.bids.find(
      bid => bid._id.toString() === bidId && bid.status === 'Accepted'
    );

    if (!acceptedBid) {
      return res.status(404).json({ error: 'Accepted bid not found.' });
    }

    // Get the complete user details for the accepted bid
    const user = await User.findById(acceptedBid.user);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Include user details in the acceptedBid object
    const acceptedBidWithUserDetails = {
      ...acceptedBid.toObject(),
      user: {
        _id: user._id,
        name: user.name,
        address: user.address,
        gstNo: user.gstNo,
        mobileNo: user.mobileNo,
        pincode: user.pincode,
        state: user.state,
        shippingAddress: user.shippingAddress,
      },
    };

    res.status(200).json({ offer, acceptedBid: acceptedBidWithUserDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};







