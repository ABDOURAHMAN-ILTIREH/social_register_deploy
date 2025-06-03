const { Menage, Logement, Equipement, Plainte, Entretien,AuditLog } = require('../models');
const { Personne } = require('../models');

// Ajouter un ménage avec validation
exports.createMenage = async (req, res) => {
  try {
    const {
      enqueteur_id,
      ...menageDate
    } = req.body;

    if (!enqueteur_id) {
      return res.status(400).json({ message: 'Certains champs obligatoires sont manquants.' });
    }


    const menage = await Menage.create({
      ...menageDate,
      enqueteur_id
    });

    res.status(201).json(menage);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du ménage', error });
  }
};

// Récupérer tous les ménages avec leurs personnes associées
exports.getAllMenages = async (req, res) => {
  try {
    const menages = await Menage.findAll({});

    res.status(200).json(menages);

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des ménages', error });
  }
};


exports.deleteMenage = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Vérifie si le ménage existe
    const menage = await Menage.findByPk(id);
    if (!menage) {
      return res.status(404).json({
        success: false,
        message: 'Ménage non trouvé'
      });
    }

    // 3. Suppression des dépendances
    await Personne.destroy({ where: { menage_id: id } });
    await Logement.destroy({ where: { menage_id: id } });
    await Equipement.destroy({ where: { menage_id: id } });
    await Plainte.destroy({ where: { menage_id: id } });
    await Entretien.destroy({ where: { menage_id: id } });

    // 4. Suppression du ménage
    await menage.destroy();

    // 5. Réponse
    res.status(200).json({
      success: true,
      message: 'Ménage et données associées supprimés avec succès',
      deletedId: id
    });

  } catch (error) {
    console.error('Erreur suppression ménage:', error);
    res.status(500).json({
      success: false,
      message: 'Échec de la suppression',
      error: error.message
    });
  }
};




// Récupérer les personnes d'un ménage spécifique
exports.getPersonnesByMenageId = async (req, res) => {
  try {
    const { menageId } = req.params;

    // Récupérer le ménage avec les personnes associées
    const menage = await Menage.findByPk(menageId);

    if (!menage) {
      return res.status(404).json({ message: 'Ménage non trouvé' });
    }

    res.status(200).json(menage); // Renvoyer les personnes associées
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des personnes', error });
  }
};

// controllers/menage.controller.js
exports.getMenageWithMembers = async (req, res) => {
  try {
    const menageId = parseInt(req.params.id);
    
    if (isNaN(menageId)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const menage = await Menage.findByPk(menageId); // ✅ Utiliser le modèle Menage
    if (!menage) {
      return res.status(404).json({ message: 'Ménage non trouvé' });
    }

    const members = await Personne.findAll({ 
      where: { menage_id: menageId },
      attributes: { exclude: ['password'] } // Exclure les champs sensibles s'il y en a
    });

    res.status(200).json(members);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



// Backend (Node.js/Express)
exports.createComplete = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // 1. Création du ménage
    const menage = await Menage.create(req.body.menage, { transaction });

    // 2. Création des entités liées en parallèle
    await Promise.all([
      Logement.create({ ...req.body.logement, menage_id: menage.id }, { transaction }),
      Equipement.create({ ...req.body.equipement, menage_id: menage.id }, { transaction }),
      Entretien.create({
        menage_id: menage.id,
        enqueteur_id: req.body.enqueteur_id
      }, { transaction })
    ]);

    await transaction.commit();
    res.status(201).json({ menage });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: "Erreur lors de la création" });
  }
};




// Mettre à jour un ménage par ID
exports.updateMenage = async (req, res) => {
  try {
    const menageId = parseInt(req.params.id);

    // 1. Vérifier si le ménage existe
    const menage = await Menage.findByPk(menageId);
    if (!menage) {
      return res.status(404).json({ message: 'Ménage non trouvé' });
    }

    // 2. Mettre à jour les champs avec les données du corps de la requête
    await menage.update(req.body);

    // 3. Retourner le ménage mis à jour
    res.status(200).json({
      success: true,
      message: 'Ménage mis à jour avec succès',
      data: menage
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du ménage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du ménage',
      error: error.message
    });
  }
};

// Récupérer un ménage par ID
exports.getMenageById = async (req, res) => {
  try {
    const menageId = parseInt(req.params.id);

    // 1. Rechercher le ménage
    const menage = await Menage.findByPk(menageId);

    // 2. Vérifier s'il existe
    if (!menage) {
      return res.status(404).json({ 
        success: false,
        message: 'Ménage non trouvé' 
      });
    }

    // 3. Retourner le ménage
    res.status(200).json(menage)

  } catch (error) {
    console.error('Erreur lors de la récupération du ménage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la récupération du ménage',
      error: error.message 
    });
  }
};

