const express = require('express');
const router = express.Router();
const plainteController = require('../controller/plainteController');

const { authenticateToken } = require("../middleware/authenticate");
router.use(authenticateToken);

// Routes pour les plaintes
router.post('/plaintes', plainteController.createPlainte);
router.get('/plaintes', plainteController.getAllPlaintes);
router.get('/plaintes/:id', plainteController.getPlainteById);
router.put('/plaintes/:id', plainteController.updatePlainte);
router.delete('/plaintes/:id', plainteController.deletePlainte);

router.get('/plaintes/:menage_id/plainte', plainteController.getByMenageIdPlainte);

module.exports = router;