const express = require('express');
const proformaController = require('../controllers/proformaController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/create', authenticateToken, proformaController.createProforma);
router.put('/update/:proformaId', authenticateToken, proformaController.updateProforma);
router.delete('/delete/:proformaId', authenticateToken, proformaController.deleteProforma);
router.post('/send/:proformaId', authenticateToken, proformaController.sendProforma);
router.get('/get/:proformaId', authenticateToken, proformaController.getProformaById);
router.get('/proformas', authenticateToken, proformaController.getAllProformas);

// router.get('/user/:userId/proforma', authenticateToken, proformaController.getUserProforma);
module.exports = router;
