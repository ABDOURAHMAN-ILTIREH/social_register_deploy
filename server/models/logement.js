
module.exports = (sequelize, DataTypes) => {
    const Logement = sequelize.define('Logement', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
      statut_occupation: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type_logement: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      materiau_murs: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      materiau_toiture: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nature_sol: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      source_energie_cuisson: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      source_energie_eclairage: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    
      source_eau: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      
      possede_toilletes: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      nature_usage_de_toilletes: {
        type: DataTypes.ENUM("Privé","Partagé avec d'autres ménages"),
        allowNull: true,
      },
        
    });

    return Logement;
  };