
module.exports = (sequelize, DataTypes) => {
    const Personne = sequelize.define('Personne', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
      nom_prenoms: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      sexe: {
        type: DataTypes.ENUM('Masculin', 'Féminin'),
        allowNull: false,
      },
      date_naissance: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      age: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      lien_parental: {
        type: DataTypes.ENUM('chef de ménage','conjoint du chef de menage','Père ou mère CM', 'Fils ou Fille CM',
            'Gendre ou belle fille','Petit-fils ou petite-fille', 'oncle ou tante','Frère ou soeur', 'Beau-fils ou belle-fille',
           'Beau-père ou belle-mère','Neveu ou nièce','Cousin ou cousine', 'Enfant adopté','Autres parents','Sans parent'),
        allowNull: false,
      },
      etat_matrimonial: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      piece_identite: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      numero_identite: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      enceinte: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      orphelin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      orphelin_du_quelle_parents: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      scolarisation: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      niveau_instruction: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      statut_occupation: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      statut_emploi: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      activite_principale: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      handicape: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      membre_oragane_handicape: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      
      numero_carte_handicap: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      
      
    });
    return Personne;
  };