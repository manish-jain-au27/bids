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

    // Check if there is an existing offer for the same count that is not closed
    const existingOffer = await Offer.findOne({ companyId, count, status: { $ne: 'Closed' } });
    if (existingOffer) {
      return res.status(400).json({ error: 'Another offer for the same count is still live.' });
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
      commission: company.commission,
    });

    await offer.save();

    // Check if the offer should be closed
    if (noOfBags === 0) {
      const acceptedBid = await Bid.findOne({ offerId: offer._id, status: 'Accepted' });
      if (acceptedBid) {
        offer.status = 'Closed';
        await offer.save();
        console.log('Offer closed:', offer);
        return res.status(400).json({ error: 'Offer closed as noOfBags is 0 and a bid was accepted.' });
      }
    }

    console.log('Offer created:', offer);

    res.status(201).json({ offer });
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

    // Check if the number of bags is less than 0
    if (noOfBags < 0) {
      return res.status(400).json({ error: 'Number of bags cannot be less than 0.' });
    }

    // Update the offer with the new values
    offer.rate = rate;
    offer.noOfBags = noOfBags;
    offer.deliveryDays = deliveryDays;
    offer.time = time;
    offer.updatedAt = new Date();

    // Check if the offer should be expired
    if (noOfBags === 0) {
      const acceptedBid = await Bid.findOne({ offerId: offer._id, status: 'Accepted' });
      if (acceptedBid) {
        offer.status = 'Expired';
        await offer.save();
        console.log('Offer expired:', offer);
        return res.status(400).json({ error: 'Offer expired as noOfBags is 0 and a bid was accepted.' });
      }
    }

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

    // Find live offers for the company
    const liveOffers = await Offer.find({ 
      companyId, 
      status: 'Live',
    });

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

    const allOffers = await Offer.find({ 
      companyId, 
      status: { $nin: ['Withdrawn', 'Closed'] },
      noOfBags: { $gt: 0 }, // Exclude offers with noOfBags equal to 0
    });

    // Check and close offers with noOfBags equal to 0
    const expiredOffers = allOffers.filter(offer => offer.noOfBags === 0);
    if (expiredOffers.length > 0) {
      await Offer.updateMany({ _id: { $in: expiredOffers.map(offer => offer._id) } }, { status: 'Closed' });
      console.log('Expired offers closed:', expiredOffers);
    }

    // Filter out offers with noOfBags equal to 0
    const validOffers = allOffers.filter(offer => offer.noOfBags > 0);

    res.status(200).json({ offers: validOffers });
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

    const offer = await Offer.findById(offerId).populate('productId').populate('companyId');

    if (!offer) {
      return res.status(404).json({ error: `Offer with ID ${offerId} not found` });
    }

    if (offer.status !== 'Live') {
      return res.status(400).json({ error: `Offer with ID ${offerId} is no longer live` });
    }

    const acceptedBid = offer.bids.find(bid => bid._id.toString() === bidId);

    if (!acceptedBid) {
      return res.status(404).json({ error: `Bid with ID ${bidId} not found in the offer` });
    }

    if (acceptedBid.status === 'Rejected') {
      return res.status(400).json({ error: `Bid with ID ${bidId} has already been rejected` });
    }

    if (acceptedBid.status === 'Accepted') {
      return res.status(400).json({ error: `Bid with ID ${bidId} has already been accepted` });
    }

    if (acceptedBid.noOfBags > offer.noOfBags) {
      return res.status(400).json({ error: `Bid with ID ${bidId} has more bags than available in the offer` });
    }

    // Accept the bid
    acceptedBid.status = 'Accepted';

    // Save the updated offer
    await offer.save();

    // Check if the offer should be closed
    const proformaGenerated = true; // Assuming the proforma is generated
    if (proformaGenerated) {
      offer.status = 'Closed';
      await offer.save();
    }

    // Return success response
    res.status(200).json({ message: 'Bid accepted successfully', acceptedBid, offer });
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

    // Find the offer by ID and populate the product, company, and acceptedBid details
    const offer = await Offer.findById(offerId)
      .populate({
        path: 'productId',
        select: 'weight',
      })
      .populate({
        path: 'companyId',
        select: 'companyName shortName registerAddress factoryAddress mobileNo gstNo email accManagerName accManagerNo dispatchManagerName dispatchManagerMobileNo bankDetails commission',
      })
      .select('bids')
      .lean();

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    // Find the accepted bid within the offer
    const acceptedBid = offer.bids.find(bid => bid._id.toString() === bidId && bid.status === 'Accepted');

    if (!acceptedBid) {
      return res.status(404).json({ error: 'Accepted bid not found.' });
    }

    // Get the complete user details for the accepted bid
    const user = await User.findById(acceptedBid.user._id).select('name mobileNo gstNo email state shippingAddress');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Include user and company details in the acceptedBid object
    acceptedBid.user = user;
    acceptedBid.companyDetails = offer.companyId;

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







