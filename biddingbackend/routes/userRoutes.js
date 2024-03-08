const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');

// User registration route
router.post('/register', userController.registerUser);

// User login route
router.post('/login', userController.loginUser);

// Get live offers route (requires authentication)
router.get('/live-offers', authenticateToken, userController.getLiveOffersByAllCompanies);

// Get user details route (requires authentication)
router.get('/user-details', authenticateToken, userController.getUserDetails);

// Place bid on offer route (requires authentication)
router.post('/place-bid', authenticateToken, userController.placeBidOnOffer);

// Get user bids route (requires authentication)
router.get('/user-bids', authenticateToken, userController.getUserBids);

// Get wishlist route (requires authentication)
router.get('/wishlist', authenticateToken, userController.getWishlist);

// Add to wishlist route (requires authentication)
router.post('/wishlist/add', authenticateToken, userController.addToWishlist);


router.delete('/wishlist/delete/:productId', authenticateToken, userController.deleteWishlistItem);

// Get wishlist products route (requires authentication)
router.get('/wishlist/products', authenticateToken, userController.getWishlistProducts);

// Get all products route (requires authentication)
router.get('/all-products', authenticateToken, userController.getAllProductsForUser);

module.exports = router;
