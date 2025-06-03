module.exports = (sequelize, DataTypes) => {
    const Entretien = sequelize.define('Entretien', {
      // ... (champs du modèle)
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
    },
       
    });
  
  
    return Entretien;
  };