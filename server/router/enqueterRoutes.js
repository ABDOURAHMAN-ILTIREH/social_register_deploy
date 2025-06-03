const express = require('express');
const router = express.Router();
const enqueteurController = require('../controller/enqueterController');

const { authenticateToken } = require("../middleware/authenticate");
router.use(authenticateToken);

// Routes pour les enquêteurs
router.post('/enqueteurs', enqueteurController.createEnqueteur);
router.get('/enqueteurs', enqueteurController.getAllEnqueteurs);
router.get('/enqueteurs/:id',enqueteurController.getEnqueteurById);
router.put('/enqueteurs/:id',enqueteurController.updateEnqueteur);
router.delete('/enqueteurs/:id',enqueteurController.deleteEnqueteur);

module.exports = router;