const { Menage } = require('../models');
const { Equipement } = require('../models');

// Créer un équipement
exports.createEquipement = async (req, res) => {
  try {
    const { menage_id, ...equipementData } = req.body;

    // Vérifier si le ménage existe
    const menage = await Menage.findByPk(menage_id);
    if (!menage) {
      return res.status(404).json({ message: 'Ménage non trouvé' });
    }

    const equipement = await Equipement.create({ ...equipementData, menage_id });
    res.status(201).json(equipement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'équipement', error });
  }
};

// Récupérer tous les équipements
exports.getAllEquipements = async (req, res) => {
  try {
    const equipements = await Equipement.findAll({ include: Menage });
    res.status(200).json(equipements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des équipements', error });
  }
};

// Récupérer un équipement par ID
exports.getEquipementById = async (req, res) => {
  try {
    const equipement = await Equipement.findByPk(req.params.id);
    if (!equipement) {
      return res.status(404).json({ message: 'Équipement non trouvé' });
    }
    res.status(200).json(equipement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'équipement', error });
  }
};

// Mettre à jour un équipement
exports.updateEquipement = async (req, res) => {
  try {
    const { menage_id, ...equipementData } = req.body;

    const [updated] = await Equipement.update(equipementData, { where: { menage_id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Équipement non trouvé' });
    }

    const updatedEquipement = await Equipement.findByPk(req.params.id, { include: Menage });
    res.status(200).json(updatedEquipement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'équipement', error });
  }
};

// Supprimer un équipement
exports.deleteEquipement = async (req, res) => {
  try {
    const deleted = await Equipement.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Équipement non trouvé' });
    }
    res.status(204).json({ message: 'Équipement supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'équipement', error });
  }
};

// Obtenir l'équipement par menage_id
exports.getByMenageIdByEquipement = async (req, res) => {
  try {
    const equipement = await Equipement.findOne({ 
      where: { menage_id: req.params.menage_id }
    });

    if (!equipement) {
      return res.status(404).json({ 
        success: false,
        message: 'Équipement non trouvé pour ce ménage'
      });
    }

    res.status(200).json({
      success: true,
      data: equipement
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

