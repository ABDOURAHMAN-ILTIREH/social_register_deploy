module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('chef_de_service', 'coordinateur','nouveaux_utilisateur'),
        allowNull: false,
        defaultValue:'nouveaux_utilisateur',
      },// In your User model definition add:
      resetToken: {
        type: DataTypes.STRING(255),
        default: null
      },
      resetTokenExpiry: {
        type: DataTypes.DATE,
        default: null
      },
      tokenVersion: {
        type: DataTypes.BIGINT,
        default: 0
      }},
      {
        timestamps: true, // Active automatiquement createdAt et updatedAt
      },
    );
  
    return User;
  };