const { Menage } = require('../models');
const { Personne } = require('../models');

// Ajouter une personne avec validation
exports.createPersonne = async (req, res) => {
  try {
    const {
      menage_id,nom_prenoms,...addPersonnes
      
    } = req.body;

   

    const personne = await Personne.create({
      ...addPersonnes,
      nom_prenoms: nom_prenoms ? nom_prenoms.toLowerCase() : nom_prenoms,
      menage_id
    });

    res.status(201).json(personne);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la personne', error });
  }
};

// Récupérer toutes les personnes
exports.getAllPersonnes = async (req, res) => {
  try {
    const personnes = await Personne.findAll({
      include: [{ model: Menage }], 
    });
    res.status(200).json(personnes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des personnes', error });
  }
};

// Récupérer une personne par ID
exports.getPersonneById = async (req, res) => {
  try {
    const personne = await Personne.findByPk(req.params.id);
    if (!personne) {
      return res.status(404).json({ message: 'Personne non trouvée' });
    }
    res.status(200).json(personne);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la personne', error });
  }
};

// Mettre à jour une personne
exports.updatePersonne = async (req, res) => {
  const {nom_prenoms,...personneData} = req.body;
  try {
    const personne = await Personne.findByPk(req.params.id);
    if (!personne) {
      return res.status(404).json({ message: 'Personne non trouvée' });
    }
    
    await personne.update({
      ...personneData,
      nom_prenoms: nom_prenoms ? nom_prenoms.toLowerCase() : nom_prenoms,
    });
    res.status(200).json(personne);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la personne', error });
  }
};

// Supprimer une personne
exports.deletePersonne = async (req, res) => {
  try {
    const personne = await Personne.findByPk(req.params.id);
    if (!personne) {
      return res.status(404).json({ message: 'Personne non trouvée' });
    }
    await personne.destroy();
    res.status(200).json({ message: 'Personne supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la personne', error });
  }
};



// Filtrer les personnes par age, nom_prenoms et numero_identite (CNI)
exports.filterPersonnes = async (req, res) => {
  try {
    const { age, nom_prenoms, numero_identite,date_naissance,scolarisaton} = req.query;

    // Construire la condition de filtrage
    const whereClause = {};
    if (nom_prenoms) whereClause.nom_prenoms = { [Op.like]: `%${nom_prenoms}%` }; // Recherche partielle
    if (numero_identite) whereClause.numero_identite = numero_identite;
    if (date_naissance) whereClause.date_naissance = date_naissance;
    if (age) whereClause.age = age;
    if(scolarisaton) whereClause.scolarisaton = scolarisaton;

    // Récupérer les personnes filtrées
    const personnes = await Personne.findAll({
      where: whereClause,
      include:[{Menage}]
    });

    res.status(200).json(personnes); // Renvoie les données en JSON
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des personnes', error });
  }
};



exports.getByMenageIdPersonnes = async (req, res) => {
  try {
    const personnes = await Personne.findAll({ 
      where: { menage_id: req.params.menage_id }
    });

    // ⚠️ `findAll` retourne toujours un tableau, jamais `null`
    if (!personnes || personnes.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Aucune personne trouvée pour ce ménage'
      });
    }

    res.status(200).json({
      success: true,
      data: personnes
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};
