const express = require('express');
const router = express.Router();
const logementController = require('../controller/logementController');

const { authenticateToken } = require("../middleware/authenticate");
router.use(authenticateToken);

// Routes pour les logements
router.post('/logements', logementController.createLogement);
router.get('/logements', logementController.getAllLogements);
router.get('/logements/:id', logementController.getLogementById);
router.put('/logements/:id', logementController.updateLogement);
router.delete('/logements/:id', logementController.deleteLogement);
router.get('/logements/:menage_id/logement', logementController.getByMenageIdLogement);

module.exports = router;