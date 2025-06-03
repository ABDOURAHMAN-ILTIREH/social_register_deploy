
module.exports = (sequelize, DataTypes) => {
    const Menage = sequelize.define('Menage', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
      date_entretien: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      resultat_interview: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      langue_interview: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      region_provenance: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      commune_residence: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      sous_prefecture: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      quartier: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      milieu_residence: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      arrondissement: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      taille_menage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      telephone_1: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      telephone_2: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      enqueteur_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'Enqueteurs',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,// Active automatiquement createdAt et updatedAt
    });
  return Menage;
};