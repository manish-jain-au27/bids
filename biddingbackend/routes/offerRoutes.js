const express = require('express');
const offerController = require('../controllers/offerController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/create', authenticateToken, offerController.createOffer);
router.put('/update/:offerId', authenticateToken, offerController.updateOffer);
router.delete('/delete/:offerId', authenticateToken, offerController.deleteOffer);
router.post('/withdraw/:offerId', authenticateToken, offerController.withdrawOffer);
router.get('/live', authenticateToken, offerController.getLiveOffers);
router.get('/get/:offerId', authenticateToken, offerController.getOfferById);
router.get('/getall', authenticateToken, offerController.getAllOffers);
router.get('/live/:count', authenticateToken, offerController.getLiveOffersByCount);

// New route to get all live offers with bids from all companies
router.get('/live-with-bids', authenticateToken, offerController.getOffersWithBids);

// New routes for accepting, rejecting, and rejecting all bids
router.put('/accept-bid/:offerId/:bidId', authenticateToken, offerController.acceptBid);
router.post('/reject-bid/:offerId/:bidId', authenticateToken, offerController.rejectBid);
router.post('/reject-all-bids/:offerId', authenticateToken, offerController.rejectAllBids);

// New route to get the accepted bid by bid ID for a specific offer
router.get('/:offerId/accepted-bid/:bidId', authenticateToken, offerController.getAcceptedBid);
router.get('/get-accepted-bid/:offerId/:bidId', authenticateToken, offerController.getAcceptedBidById);

module.exports = router;
