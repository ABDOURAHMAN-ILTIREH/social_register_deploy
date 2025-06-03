
module.exports = (sequelize, DataTypes) => {
    const Plainte = sequelize.define('Plainte', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
      categorie_plainte: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type_de_plainte: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description_plainte: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
  
    return Plainte;
  };