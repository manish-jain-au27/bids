const express = require('express');
const productController = require('../controllers/productController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

// Add product (available for all authenticated users)
router.post('/add', authenticateToken, productController.addProduct);

// Update product (available only for companies)
router.put('/update/:count', authenticateToken, productController.updateProduct);

// Delete product (available only for companies)
router.delete('/delete/:count', authenticateToken, productController.deleteProduct);

// Get all products (available for all authenticated users)
router.get('/get-all', authenticateToken, productController.getProducts);

// Get product by ID (available for all authenticated users)
router.get('/:productId', authenticateToken, productController.getProductById);

// Get product by count for company (available for all authenticated users)
router.get('/get-by-count/:count', authenticateToken, productController.getProductByCount);

module.exports = router;
