const { Personne } = require('../models'); // Adjust path as needed
const { Op } = require('sequelize');

exports.filterPersonnes = async (req, res) => {
    try {
      const {
        id,
        nom_prenoms,
        sexe,
        date_naissance,
        age,
        lien_parental,
        etat_matrimonial,
        numero_identite,
        enceinte,
        orphelin,
        scolarisation,
        niveau_instruction,
        statut_occupation,
        statut_emploi,
        activite_principale,
        handicape,
        page = 1,
        limit = 10
      } = req.query;

      // Build the filter object dynamically
      const where = {};
      
      if (id) where.id = id;
      if (nom_prenoms) where.nom_prenoms = { [Op.like]: `%${nom_prenoms}%` };
      if (sexe) where.sexe = sexe;
      if (date_naissance) where.date_naissance = date_naissance;
      if (age) where.age = age;
      if (lien_parental) where.lien_parental = lien_parental;
      if (etat_matrimonial) where.etat_matrimonial = { [Op.like]: `%${etat_matrimonial}%` };
      if (numero_identite) where.numero_identite = numero_identite;
      if (enceinte !== undefined) where.enceinte = enceinte === 'true';
      if (orphelin !== undefined) where.orphelin = orphelin === 'true';
      if (scolarisation) where.scolarisation = scolarisation;
      if (niveau_instruction) where.niveau_instruction = niveau_instruction;
      if (statut_occupation) where.statut_occupation = statut_occupation;
      if (statut_emploi) where.statut_emploi = statut_emploi;
      if (activite_principale) where.activite_principale = { [Op.like]: `%${activite_principale}%` };
      if (handicape !== undefined) where.handicape = handicape === 'true';

      // Pagination
      const offset = (page - 1) * limit;
       await new Promise(resolve => setTimeout(resolve, 500));
      
      const { count, rows } = await Personne.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: parseInt(page),
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error filtering personnes:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
}
