// index.js
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');


// Initialiser Sequelize
const sequelize = new Sequelize(dbConfig.development);

// Importer les modèles
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Menage = require('./menage')(sequelize, Sequelize.DataTypes);
const Personne = require('./personne')(sequelize, Sequelize.DataTypes);
const Logement = require('./logement')(sequelize, Sequelize.DataTypes);
const Equipement = require('./equipement')(sequelize, Sequelize.DataTypes);
const Plainte = require('./plainte')(sequelize, Sequelize.DataTypes);
const Enqueteur = require('./enqueteur')(sequelize, Sequelize.DataTypes);
const Entretien = require('./entretien')(sequelize, Sequelize.DataTypes);




// Définir les associations
Menage.belongsTo(Enqueteur, { foreignKey: 'enqueteur_id'});
Personne.belongsTo(Menage, { foreignKey: 'menage_id' , onDelete: 'CASCADE'});
Logement.belongsTo(Menage, { foreignKey: 'menage_id' , onDelete: 'CASCADE'});
Equipement.belongsTo(Menage, { foreignKey: 'menage_id' , onDelete: 'CASCADE'});
Plainte.belongsTo(Menage, { foreignKey: 'menage_id' , onDelete: 'CASCADE'});
Entretien.belongsTo(Menage, { foreignKey: 'menage_id' , onDelete:'CASCADE'});
Entretien.belongsTo(Enqueteur, { foreignKey: 'enqueteur_id'});



sequelize
  .sync({ force: false }) // `force: true` recrée les tables à chaque démarrage
  .then(() => {
    console.log('Base de données synchronisée avec succès !');
  })
  .catch((err) => {
    console.error('Erreur lors de la synchronisation de la base de données :', err);
  });

module.exports = { sequelize,User,Menage,Enqueteur,Entretien,Equipement,Plainte,Personne,Logement };


