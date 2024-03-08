const express = require('express');
const companyController = require('../controllers/companyController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/register', companyController.registerCompany);
router.post('/login', companyController.loginCompany);
router.put('/update', authenticateToken, companyController.updateCompany);
router.get('/get-company', authenticateToken, companyController.getCompany);
router.delete('/delete', authenticateToken, companyController.deleteCompany);
router.post('/logout', authenticateToken, companyController.logoutCompany);


module.exports = router;
