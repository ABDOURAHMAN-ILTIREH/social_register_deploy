import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, User, FileText, Briefcase, Heart } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import type { Personne } from '../types/database';

type FormData = Omit<Personne, 'id' | 'age' | 'menage_id'>;

const NewPerson: React.FC = () => {
  const navigate = useNavigate();
  const { id: menageId } = useParams<{ id: string }>();
  const { addPersonne } = useData();
  

  const [formData, setFormData] = useState<FormData>({
    nom_prenoms: '',
    sexe: '',
    date_naissance: '',
    lien_parental: '',
    etat_matrimonial: '',
    piece_identite: '',
    numero_identite: '',
    enceinte: false,
    orphelin: false,
    orphelin_du_quelle_parents: '',
    scolarisation: '',
    niveau_instruction: '',
    statut_occupation: '',
    statut_emploi: '',
    activite_principale: '',
    handicape: false,
     membre_oragane_handicape: '',
    numero_carte_handicap: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menageId) return;
    console.log(menageId);
    await addPersonne({
      ...formData,
      menage_id: parseInt(menageId),
      age: calculateAge(formData.date_naissance),
    });
    navigate(`/households/${menageId}`);
  };


  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/households/${menageId}`)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Retour</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Nouvelle personne</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <User className="text-blue-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Informations personnelles</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom et prénoms *
              </label>
              <input
                type="text"
                name="nom_prenoms"
                value={formData.nom_prenoms}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexe *
              </label>
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance *
              </label>
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lien de parenté *
              </label>
              <select
                name="lien_parental"
                value={formData.lien_parental}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="chef de ménage">Chef de ménage</option>
                <option value="conjoint du chef de ménage">conjoint du chef de ménage</option>
                <option value="Père ou mère CM">Père ou mère CM</option>
                <option value="Fils ou Fille CM">Fils ou Fille CM</option>
                <option value="Gendre ou belle fille">Gendre ou belle fille</option>
                <option value="Petit-fils ou petite-fille">Petit-fils ou petite-fille</option>
                <option value="oncle ou tante">oncle ou tante</option>
                <option value="Frère ou soeur">Frère ou soeur</option>
                <option value="Beau-fils ou belle-fille">Beau-fils ou belle-fille</option>
                <option value="Beau-père ou belle-mère">Beau-père ou belle-mère</option>
                <option value="Cousin ou cousine">Cousin ou cousine</option>
                <option value="Neveu ou nièce">Neveu ou nièce</option>
                <option value="Enfant adopté">Enfant adopté</option>
                <option value="Autres parents">Autres parents</option>
                <option value="Sans parent">Sans parent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                État matrimonial *
              </label>
              <select
                name="etat_matrimonial"
                value={formData.etat_matrimonial}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié(e) monogame">Marié(e) monogame</option>
                <option value="Marié polygame">Marié polygame</option>
                <option value="Divorcé(e)/séparé">Divorcé(e)/séparé</option>
                <option value="Veuf(ve)">Veuf(ve)</option>
              </select>
            </div>

            {formData.sexe === 'Féminin' && (
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="enceinte"
                    checked={formData.enceinte}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Enceinte</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Documents d'identité */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <FileText className="text-blue-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Documents d'identité</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de pièce d'identité *
              </label>
              <select
                name="piece_identite"
                value={formData.piece_identite}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Carte Nationale d'Identité">Carte Nationale d'Identité</option>
                <option value="Acte du Mariagé">Acte du Mariagé</option>
                <option value="Extrait de naissance">Extrait de naissance</option>
                <option value="Passeport">Passeport</option>
                <option value="Carte de séjour">Carte de séjour</option>
                <option value="Aucun document">Aucun document</option>
              </select>
            </div>

            {formData.piece_identite && formData.piece_identite === "Carte Nationale d'Identité"&& (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro du document
                </label>
                <input
                  type="text"
                  name="numero_identite"
                  value={formData.numero_identite}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Éducation et emploi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Briefcase className="text-blue-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Éducation et emploi</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scolarisation *
              </label>
              <select
                name="scolarisation"
                value={formData.scolarisation}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                 <option value="">Sélectionner</option>
                <option value="fréquente Actuellement">fréquente Actuellement</option>
                <option value="déjà fréquente">déjà fréquente</option>
                <option value="n'a jammais fréquente">n'a jammais fréquente</option>
              </select>
            </div>
            {formData.scolarisation !== "n'a jammais frequente" && (


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau d'instruction *
              </label>
              <select
                name="niveau_instruction"
                value={formData.niveau_instruction}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Aucun">Aucun</option>
                <option value="ecole arabe">ecole arabe</option>
                <option value="préscolaire">préscolaire</option>
                <option value="primaire">primaire</option>
                <option value="secondaire permier cycle">secondaire permier cycle</option>
                <option value="secondaire deuxieme cycle">secondaire deuxieme cycle</option>
                <option value="études universitaires">études universitaires</option>
                <option value="études supérieurs(master,doctorat) ">étude supérieur(master,doctorat) </option>
              </select>
            </div>

            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut d'occupation *
              </label>
              <select
                name="statut_occupation"
                value={formData.statut_occupation}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Aucun">Aucun</option>
                <option value="Occupé(e)">Occupé(e)</option>
                <option value="Chômeur(se)">Chômeur(se)</option>
                <option value="Retraité">Retraité</option>
                <option value="Rentier">Rentier</option>
                <option value="élève/Étudiant(e)">élève/Étudiant(e)</option>
                <option value="Personne au foyer">Personne au foyer</option>
                <option value="Autre inactif">Autre inactif</option>
              </select>
            </div>

            {formData.statut_occupation === 'Occupé(e)' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut dans l'emploi *
                  </label>
                  <select
                    name="statut_emploi"
                    value={formData.statut_emploi}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Salarié(e)">Salarié(e)</option>
                    <option value="Indépendant(e)">Indépendant(e)</option>
                    <option value="Employeur">Employeur</option>
                    <option value="Aide familial">Aide familial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activité principale
                  </label>
                  <select
                    name="activite_principale"
                    value={formData.activite_principale}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner une activité</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Élevage">Élevage</option>
                    <option value="Pêche">Pêche</option>
                    <option value="Industrie extractive">Industrie extractive</option>
                    <option value="Industrie manufacturière">Industrie manufacturière</option>
                    <option value="Eau-gaz-électricité">Eau-gaz-électricité</option>
                    <option value="Construction">Construction</option>
                    <option value="Commerce formelle (maginsins,supermarche,suprettes)<">Commerce formelle (maginsins,supermarche,suprettes)</option>
                    <option value="Reparation vehicules/moto ou appareils domestique">Reparation vehicules/moto ou appareils domestique</option>
                    <option value="Transport">Transport</option>
                    <option value="Intermédiation financier(Banque)">Intermediation financier(Banque)</option>
                    <option value="Immobilier,Location et Activiés de service aux entreprises">Immobilier,Location et Activiés de service aux entreprises</option>
                    <option value="Administration Publique et Défense">Administration Publique et Défense</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Santé et Action sociale">Santé et Action sociale</option>
                    <option value="Services domestiques">Services domestiques</option>
                    <option value="Autres Activite services collectifs">Autres Activite services collectifs</option>
                    <option value="Petite commerce/ambulant">Petite commerce/ambulant</option>
                    <option value="Vente du Khat">Vente du Khat</option>
                    <option value="Macon">Macon</option>
                    <option value="Menuisier">Menuisier</option>
                    <option value="Charpentier">Charpentier</option>
                    <option value="Potier">Potier</option>
                    <option value="Vannier">Vannier</option>
                    <option value="Meunier">Meunier</option>
                    <option value="Forgeron">Forgeron</option>
                    <option value="Tailleur">Tailleur</option>
                    <option value="Cordonnier">Cordonnier</option>
                    <option value="Tricoteur">Tricoteur</option>
                    <option value="Accoucheuse Traditionnelle">Accoucheuse Traditionnelle</option>
                    <option value="Femme de ménage / Domestique">Femme de ménage / Domestique</option>
                    <option value="Gardien/Veilleur/Agent de sécurité">Gardien/Veilleur/Agent de sécurité</option>
                    <option value="Chauffeur Particulier (taxi auto/Moto/Bus/convoyeur)">Chauffeur Particulier (taxi auto/Moto/Bus/convoyeur)</option>
                    <option value="Docker">Docker</option>
                  
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Situation particulière */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Heart className="text-blue-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Situation particulière</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="orphelin"
                  checked={formData.orphelin}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Orphelin(e)</span>
              </label>
            </div>
            {formData.orphelin &&(
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                orphelin du qu'elle parents*
              </label>
              <select
                name="orphelin_du_quelle_parents"
                value={formData.orphelin_du_quelle_parents}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="orphelin de père">orphelin de père</option>
                <option value="orphelin de mère">orphelin de mère</option>
                <option value="orphelin de père et de mère">orphelin de père et de mère</option>
              </select>
            </div>
            )}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="handicape"
                  checked={formData.handicape}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Personne en situation de handicap</span>
              </label>
            </div>
            {
              formData.handicape &&(
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                handicap du qu'elle organier *
              </label>
              <select
                name="membre_oragane_handicape"
                value={formData.membre_oragane_handicape}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="Aveugle">Aveugle</option>
                <option value="Muet/Sourd">Muet/Sourd</option>
                <option value="Infirme des membre supérieurs">Infirme des membre supérieurs</option>
                <option value="Infirme des membre inferieur">Infirme des membre inferieur</option>
                <option value="Déficience Mentale">Déficience Mentale</option>
                <option value="Autre Handicape">Autre Handicape</option>
              </select>
            </div>
            )}
              
            {formData.handicape && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de carte de handicap
                </label>
                <input
                  type="text"
                  name="numero_carte_handicap"
                  value={formData.numero_carte_handicap}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save size={18} className="mr-2" />
            Enregistrer
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default NewPerson;