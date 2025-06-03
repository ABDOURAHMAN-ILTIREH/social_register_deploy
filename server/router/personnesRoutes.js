const express = require('express');
const router = express.Router();
const personneController = require('../controller/personnesController');
const filterpersonneController = require('../controller/filterPersonneController');

// Route pour filtrer les personnes

const { authenticateToken } = require("../middleware/authenticate");
router.use(authenticateToken);

router.get('/personnesQuery', filterpersonneController.filterPersonnes);
router.post('/personnes', personneController.createPersonne);
router.get('/personnes', personneController.getAllPersonnes);
router.get('/personnes/:id', personneController.getPersonneById);
router.put('/personnes/:id', personneController.updatePersonne);
router.delete('/personnes/:id', personneController.deletePersonne);

router.get('/personnes/:menage_id/members', personneController.getByMenageIdPersonnes);

module.exports = router;
