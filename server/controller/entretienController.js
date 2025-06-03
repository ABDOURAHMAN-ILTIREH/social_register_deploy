const { Enqueteur } = require('../models');
const { Menage } = require('../models');
const { Entretien } = require('../models');

// Créer un entretien
exports.createEntretien = async (req, res) => {
  try {
    const { menage_id, enqueteur_id, ...entretienData } = req.body;

    // Vérifier si le ménage et l'enquêteur existent
    const menage = await Menage.findByPk(menage_id);
    const enqueteur = await Enqueteur.findByPk(enqueteur_id);
    if (!menage || !enqueteur) {
      return res.status(404).json({ message: 'Ménage ou enquêteur non trouvé' });
    }

    const entretien = await Entretien.create({ ...entretienData, menage_id, enqueteur_id });
    res.status(201).json(entretien);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'entretien', error });
  }
};

// Récupérer tous les entretiens
exports.getAllEntretiens = async (req, res) => {
  try {
    const entretiens = await Entretien.findAll({ include: [Menage, Enqueteur] });
    res.status(200).json(entretiens);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des entretiens', error });
  }
};

// Récupérer un entretien par ID
exports.getEntretienById = async (req, res) => {
  try {
    const entretien = await Entretien.findByPk(req.params.id, { include: [Menage, Enqueteur] });
    if (!entretien) {
      return res.status(404).json({ message: 'Entretien non trouvé' });
    }
    res.status(200).json(entretien);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'entretien', error });
  }
};

// Mettre à jour un entretien
exports.updateEntretien = async (req, res) => {
  try {
    const { menage_id, enqueteur_id, ...entretienData } = req.body;

    const [updated] = await Entretien.update(entretienData, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Entretien non trouvé' });
    }

    const updatedEntretien = await Entretien.findByPk(req.params.id, { include: [Menage, Enqueteur] });
    res.status(200).json(updatedEntretien);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'entretien', error });
  }
};

// Supprimer un entretien
exports.deleteEntretien = async (req, res) => {
  try {
    const deleted = await Entretien.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Entretien non trouvé' });
    }
    res.status(204).json({ message: 'Entretien supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'entretien', error });
  }
};