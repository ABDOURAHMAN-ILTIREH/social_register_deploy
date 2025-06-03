
module.exports = (sequelize, DataTypes) => {
    const Equipement = sequelize.define('Equipement', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
      table_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      matelas: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      nattes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lits: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      chaises: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      televiseurs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      radios: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      ventilateurs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      climatiseurs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      telephone_mobile: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      refrigerateur: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      ordinateur: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      machine_a_laver: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
       bicyclette: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      motocyclette: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      vehicule: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      bovins: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      ovins: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      camelins: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      volailles: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
        
    });
   
    return Equipement;
  };