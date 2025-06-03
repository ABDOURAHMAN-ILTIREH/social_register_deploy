const express = require('express');
const router = express.Router();
const menageController = require('../controller/menagesController');
const filterMenagesController = require('../controller/filterMenageController');

// Route pour filtrer les Menages
router.get('/menagesQuery/', filterMenagesController.filterMenages);

const { authenticateToken } = require("../middleware/authenticate");
router.use(authenticateToken);

router.post('/menages/', menageController.createMenage);
router.get('/menages/', menageController.getAllMenages);
router.get('/menages/:id', menageController.getMenageById);
router.put('/menages/:id', menageController.updateMenage);
router.delete('/menages/:id', menageController.deleteMenage);
router.get('/menages/:id/members', menageController.getMenageWithMembers);
router.post('/menages/complete',menageController.createComplete);

module.exports = router;
