const { Menage } = require('../models');
const { Plainte } = require('../models');

// Créer une plainte
exports.createPlainte = async (req, res) => {
  try {
    const { menage_id,description_plainte, ...plainteData } = req.body;

    // Vérifier si le ménage existe
    const menage = await Menage.findByPk(menage_id);
    if (!menage) {
      return res.status(404).json({ message: 'Ménage non trouvé' });
    }
  
    const plainte = await Plainte.create({ 
      ...plainteData,
       description_plainte: description_plainte ? description_plainte.toLowerCase() : description_plainte,
       menage_id
     });

    res.status(201).json(plainte);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la plainte', error });
  }
};

// Récupérer toutes les plaintes
exports.getAllPlaintes = async (req, res) => {
  try {
    const plaintes = await Plainte.findAll();
    res.status(200).json(plaintes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des plaintes', error });
  }
};

// Récupérer une plainte par ID
exports.getPlainteById = async (req, res) => {
   const { description_plainte, ...plainteData } = req.body;
  try {
    const plainte = await Plainte.findByPk(req.params.id);

    if (!plainte) {
      return res.status(404).json({ message: 'Plainte non trouvée' });
    }

    res.status(200).json({
      ...plainteData,
       description_plainte: description_plainte ? description_plainte.toLowerCase() : description_plainte,
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la plainte', error });
  }
};

// Mettre à jour une plainte
exports.updatePlainte = async (req, res) => {
  try {
    const { menage_id, ...plainteData } = req.body;

    const [updated] = await Plainte.update(plainteData, { where: { menage_id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Plainte non trouvée' });
    }

    const updatedPlainte = await Plainte.findByPk(req.params.id, { include: Menage });
    res.status(200).json(updatedPlainte);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la plainte', error });
  }
};

// Supprimer une plainte
exports.deletePlainte = async (req, res) => {
  try {
    const deleted = await Plainte.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Plainte non trouvée' });
    }
    res.status(204).json({ message: 'Plainte supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la plainte', error });
  }
};

// Obtenir la plainte par menage_id
exports.getByMenageIdPlainte = async (req, res) => {
  try {
    const plainte = await Plainte.findOne({ 
      where: { menage_id: req.params.menage_id }
    });

    if (!plainte) {
      return res.status(404).json({ 
        success: false,
        message: 'Plainte non trouvée pour ce ménage'
      });
    }

    res.status(200).json({
      success: true,
      data: plainte
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};