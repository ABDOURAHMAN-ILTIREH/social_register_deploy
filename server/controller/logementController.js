const { Menage } = require('../models');
const { Logement } = require('../models');

// Créer un logement
exports.createLogement = async (req, res) => {
  try {
    const { menage_id, ...logementData } = req.body;

    // Vérifier si le ménage existe
    const menage = await Menage.findByPk(menage_id);
    if (!menage) {
      return res.status(404).json({ message: 'Ménage non trouvé' });
    }

    
    const logement = await Logement.create({ ...logementData, menage_id });
    res.status(201).json(logement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du logement', error });
  }
};

// Récupérer tous les logements
exports.getAllLogements = async (req, res) => {
  try {
    const logements = await Logement.findAll({ include: Menage });
    res.status(200).json(logements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logements', error });
  }
};

// Récupérer un logement par ID
exports.getLogementById = async (req, res) => {
  try {
    const LogementId = parseInt(req.params.id);
    const logement = await Logement.findByPk(LogementId);
    if (!logement) {
      return res.status(404).json({ message: 'Logement non trouvé' });
    }
    res.status(200).json(logement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du logement', error });
  }
};

// Mettre à jour un logement
exports.updateLogement = async (req, res) => {
  try {
    const { menage_id, ...logementData } = req.body;

    const [updated] = await Logement.update(logementData, { where: { menage_id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Logement non trouvé' });
    }

    const updatedLogement = await Logement.findByPk(req.params.id, { include: Menage });
    res.status(200).json(updatedLogement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du logement', error });
  }
};

// Supprimer un logement
exports.deleteLogement = async (req, res) => {
  try {
    const deleted = await Logement.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Logement non trouvé' });
    }
    res.status(204).json({ message: 'Logement supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du logement', error });
  }
};

// Obtenir le logement par menage_id
exports.getByMenageIdLogement = async (req, res) => {
  try {
    const logement = await Logement.findOne({ 
      where: { menage_id: req.params.menage_id }
    });

    if (!logement) {
      return res.status(404).json({ 
        success: false,
        message: 'Logement non trouvé pour ce ménage'
      });
    }

    res.status(200).json({
      success: true,
      data: logement
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};