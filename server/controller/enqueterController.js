const { Enqueteur,Entretien } = require('../models');

// Créer un enquêteur
exports.createEnqueteur = async (req, res) => {
  try {
    const { nom, guichet_social } = req.body;
    const enqueteur = await Enqueteur.create({ nom, guichet_social });
    res.status(201).json(enqueteur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'enquêteur', error });
  }
};

// Récupérer tous les enquêteurs
exports.getAllEnqueteurs = async (req, res) => {
  try {
    const enqueteurs = await Enqueteur.findAll();
    res.status(200).json(enqueteurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des enquêteurs', error });
  }
};

// Récupérer un enquêteur par ID
exports.getEnqueteurById = async (req, res) => {
  try {
    const enqueteur = await Enqueteur.findByPk(req.params.id);
    if (!enqueteur) {
      return res.status(404).json({ message: 'Enquêteur non trouvé' });
    }
    res.status(200).json(enqueteur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'enquêteur', error });
  }
};

// Mettre à jour un enquêteur
exports.updateEnqueteur = async (req, res) => {
  try {
    const enqueteur = await Enqueteur.findByPk(req.params.id);
    if (!enqueteur) {
      return res.status(404).json({ message: 'Enqueteur non trouvée' });
    }
    await enqueteur.update(req.body);
    res.status(200).json(enqueteur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'enquêteur', error });
  }
};

// Supprimer un enquêteur
exports.deleteEnqueteur = async (req, res) => {
  try {
     const enq= await Enqueteur.findByPk(req.params.id);
    if (!enq) {
      return res.status(404).json({ message: 'Enqueteur non trouvée' });
    }

    await Promise.all([
      Entretien.destroy({ where: { enqueteur_id: enq.id } })
    ]);

   await enq.destroy();
   res.status(204).json({ message: 'Enquêteur supprimé' });

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'enquêteur', error });
  }
};