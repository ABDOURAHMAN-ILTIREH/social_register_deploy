const { Op } = require('sequelize');

exports.filterMenages = async (req, res) => {
    try {
      const {
        id,
        date_entretien,
        region_provenance,
        commune_residence,
        sous_prefecture,
        quartier,
        milieu_residence,
        arrondissement,
        taille_menage,
        telephone_1,
        page = 1,
        limit = 10,
      } = req.query;

      // Build the filter object dynamically
      const where = {};
      
      if (id) where.id = id;
      if (date_entretien) where.date_entretien = date_entretien;
      if (region_provenance) where.region_provenance = { [Op.like]: `%${region_provenance}%` };
      if (commune_residence) where.commune_residence = { [Op.like]: `%${commune_residence}%` };
      if (sous_prefecture) where.sous_prefecture = { [Op.like]: `%${sous_prefecture}%` };
      if (quartier) where.quartier = { [Op.like]: `%${quartier}%` };
      if (milieu_residence) where.milieu_residence = { [Op.like]: `%${milieu_residence}%` };
      if (arrondissement) where.arrondissement = { [Op.like]: `%${arrondissement}%` };
      if (taille_menage) where.taille_menage = taille_menage;
      if (telephone_1) where.telephone_1 = telephone_1;


      // Pagination
      const offset = (page - 1) * limit;
      
      const { count, rows } = await req.db.Menage.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: offset,
        order: [['date_entretien', 'DESC']] // Default sorting by interview date
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
      console.error('Error filtering menages:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
};