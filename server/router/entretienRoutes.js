const express = require('express');
const router = express.Router();
const entretienController = require('../controller/entretienController');

const { authenticateToken } = require("../middleware/authenticate");
router.use(authenticateToken);


// Routes pour les entretiens
router.post('/entretiens', entretienController.createEntretien);
router.get('/entretiens', entretienController.getAllEntretiens);
router.get('/entretiens/:id', entretienController.getEntretienById);
router.put('/entretiens/:id', entretienController.updateEntretien);
router.delete('/entretiens/:id', entretienController.deleteEntretien);

module.exports = router;