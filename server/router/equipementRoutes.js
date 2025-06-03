const express = require('express');
const router = express.Router();
const equipementController = require('../controller/equipementController');

const { authenticateToken } = require("../middleware/authenticate");
router.use(authenticateToken);

// Routes pour les équipements
router.post('/equipements', equipementController.createEquipement);
router.get('/equipements', equipementController.getAllEquipements);
router.get('/equipements/:id', equipementController.getEquipementById);
router.put('/equipements/:id', equipementController.updateEquipement);
router.delete('/equipements/:id', equipementController.deleteEquipement);

router.get('/equipements/:menage_id/equipement', equipementController.getByMenageIdByEquipement);

module.exports = router;