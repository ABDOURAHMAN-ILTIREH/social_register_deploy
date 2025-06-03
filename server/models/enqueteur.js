
module.exports = (sequelize, DataTypes) => {
    const Enqueteur = sequelize.define('Enqueteur', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
      nom: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      guichet_social: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    });

    return Enqueteur;
  };