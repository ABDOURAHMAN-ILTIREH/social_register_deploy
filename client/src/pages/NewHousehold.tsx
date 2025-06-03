import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Home, UserCheck, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import type { Menage, Logement, Equipement, Plainte } from '../types/database';



type FormStep = 'household' | 'housing' | 'equipment' | 'complaints';

const NewHousehold: React.FC = () => {
  const navigate = useNavigate();
  const { addMenage, addLogement, addEquipement, enqueteurs, addPlainte ,addEntreteint} = useData();
  const [currentStep, setCurrentStep] = useState<FormStep>('household');
  const [householdId, setHouseholdId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEnqueteur, setSelectedEnqueteur] = useState<number | null>(null);




  const [householdData, setHouseholdData] = useState<Omit<Menage, 'id'|'enqueteur_id' >>({
    date_entretien: new Date().toISOString().split('T')[0],
    resultat_interview: '',
    langue_interview: '',
    region_provenance: '',
    commune_residence: '',
    sous_prefecture:'',
    quartier: '',
    milieu_residence: 'urbain',
    arrondissement:'',
    taille_menage: 1,
    telephone_1: '',
    telephone_2: ''
  });

  const [housingData, setHousingData] = useState<Omit<Logement, 'id' | 'menage_id'>>({
    statut_occupation: '',
    type_logement: '',
    materiau_murs: '',
    materiau_toiture: '',
    nature_sol: '',
    source_energie_cuisson: '',
    source_energie_eclairage: '',
    source_eau: '',
    possede_toilletes: false,
    nature_usage_de_toilletes: '',
    
  });

  const [equipmentData, setEquipmentData] = useState<Omit<Equipement, 'id' | 'menage_id'>>({
    table_count: 0,
    matelas: 0,
    nattes: 0,
    lits: 0,
    chaises: 0,
    televiseurs: 0,
    radios: 0,
    ventilateurs: 0,
    telephone_mobile: 0,
    refrigerateur: 0,
    ordinateur: 0,
    machine_a_laver: 0,
    bicyclette: 0,
    motocyclette: 0,
    vehicule: 0,
    bovins: 0,
    ovins: 0,
    camelins: 0,
    volailles: 0,
    climatiseur: 0
  });

  const [complaintData, setComplaintData] = useState<Omit<Plainte, 'id' | 'menage_id' | 'createdAt'>>({
    categorie_plainte: '',
    type_de_plainte: '',
    description_plainte: '',
  });

  const handleHouseholdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEnqueteur) {
      alert('Veuillez sélectionner un enquêteur');
      return;
    }

    setIsSaving(true);
    try {
      
      const menage = await addMenage({
        ...householdData,
        enqueteur_id : selectedEnqueteur
      }); 
      setHouseholdId(menage.id);

      // Create interview record
      await addEntreteint({
        menage_id: menage.id,
        enqueteur_id: selectedEnqueteur,
      });
      setCurrentStep('housing');
    } catch (error) {
      console.error('Error saving household:', error);
      // alert('Une erreur est survenue lors de l\'enregistrement du ménage');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHousingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdId) return;
    
    setIsSaving(true);
    try {
      await addLogement({
        ...housingData,
        menage_id: householdId
      });
      
      setCurrentStep('equipment');

    } catch (error) {
      console.error('Error saving housing:', error);
      alert('Une erreur est survenue lors de l\'enregistrement du logement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdId) return;
    
    setIsSaving(true);
    try {
      await addEquipement({
        ...equipmentData,
        menage_id: householdId
      });
      setCurrentStep('complaints');
      
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert('Une erreur est survenue lors de l\'enregistrement des équipements');
    } finally {
      setIsSaving(false);
    }
  };
  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdId) return;
    
    setIsSaving(true);
    try {
      await addPlainte({
        ...complaintData,
        menage_id: householdId,
        createdAt: new Date().toISOString()
      });
      // window.location.reload();
      navigate(`/households/${householdId}`);

    } catch (error) {
      console.error('Error saving complaint:', error);
      alert('Une erreur est survenue lors de l\'enregistrement de la plainte');
    } finally {
      setIsSaving(false);
    }
  };


  const handleHouseholdInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setHouseholdData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleHousingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setHousingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleEquipmentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEquipmentData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };
  const handleComplaintInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/households')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Retour</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Nouveau ménage</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className={`flex-1 h-2 ${currentStep === 'household' ? 'bg-blue-500' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 ${currentStep === 'housing' ? 'bg-blue-500' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 ${currentStep === 'equipment' ? 'bg-blue-500' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 ${currentStep === 'complaints' ? 'bg-blue-500' : 'bg-gray-200'}`} />
      </div>

      {currentStep === 'household' && (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onSubmit={handleHouseholdSubmit}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Home className="text-blue-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Informations du ménage</h2>
            </div>

            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enquêteur *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck size={18} className="text-gray-400" />
                  </div>
                  <select
                    value={selectedEnqueteur || ''}
                    onChange={(e) => setSelectedEnqueteur(Number(e.target.value))}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un enquêteur</option>
                    {enqueteurs.map(enqueteur => (
                      <option key={enqueteur.id} value={enqueteur.id}>
                        {enqueteur.nom} - {enqueteur.guichet_social}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'entretien *
                </label>
                <input
                  type="date"
                  name="date_entretien"
                  value={householdData.date_entretien}
                  onChange={handleHouseholdInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Langue de l'interview *
                </label>
                <select
                  name="langue_interview"
                  value={householdData.langue_interview}
                  onChange={handleHouseholdInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une langue</option>
                  <option value="Français">Français</option>
                  <option value="Arabe">Arabe</option>
                  <option value="Somali">Somali</option>
                  <option value="Afar">Afar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Résultat de l'interview *
                </label>
                <select
                  name="resultat_interview"
                  value={householdData.resultat_interview}
                  onChange={handleHouseholdInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un résultat</option>
                  <option value="Complété">Complété</option>
                  <option value="Partiellement complété">Partiellement complété</option>
                  <option value="Refusé">Refusé</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                   Région de provenance *
                </label>
                <select
                  name="region_provenance"
                  value={householdData.region_provenance}
                  onChange={handleHouseholdInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner la region provenance</option>
                  <option value="Djibouti ville">Djibouti ville</option>
                  <option value="Arta">Arta</option>
                  <option value="Ali sabieh">Ali sabieh</option>
                  <option value="Dikhil">Dikhil</option>
                  <option value="Tadjoura">Tadjoura</option>
                  <option value="Obock">Obock</option>
                </select>
              </div>

              {
                householdData.region_provenance === "Djibouti ville" &&(
                <><div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commune de résidence *
                    </label>
                    <select
                      name="commune_residence"
                      value={householdData.commune_residence}
                      onChange={handleHouseholdInputChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner la commune residence</option>
                      <option value="Ras Dika">Ras Dika</option>
                      <option value="Boulaos">Boulaos</option>
                      <option value="Balbala">Balbala</option>
                    </select>
                  </div><div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Arrondissement de résidence *
                      </label>
                      <select
                        name="arrondissement"
                        value={householdData.arrondissement}
                        onChange={handleHouseholdInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionner un Arrondissement</option>
                        <option value="Arrondissement 1">Arrondissement 1</option>
                        <option value="Arrondissement 2">Arrondissement 2</option>
                        <option value="Arrondissement 3">Arrondissement 3</option>
                        <option value="Arrondissement 4">Arrondissement 4</option>
                        <option value="Arrondissement 5">Arrondissement 5</option>
                      </select>
                    </div></>
                )
              }

              {
                householdData.region_provenance !== "Djibouti ville" &&(
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                   Sous Prefecture *
                </label>
                <select
                  name="sous_prefecture"
                  value={householdData.sous_prefecture}
                  onChange={handleHouseholdInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner la sous prefecture</option>
                  <option value="Damerjog">Damerjog</option>
                  <option value="Kharta">Kharta</option>
                  <option value="Arta et peripherique">Arta et périphérique</option>
                  <option value="Ali_Addeh">Ali Addeh</option>
                  <option value="Holl_Holl">Holl_Holl</option>
                  <option value="Ali sabieh et peripherique">Ali sabieh et périphérique</option>
                  <option value="Mouloud">Mouloud</option>
                  <option value="As Eyla">As Eyla</option>
                  <option value="Yoboki">Yoboki</option>
                  <option value="Dikhil et peripherique">Dikhil et périphérique</option>
                  <option value="Lac Assal">Lac Assal</option>
                  <option value="Randa">Randa</option>
                  <option value="Dorra">Dorra</option>
                  <option value="Adayllou">Adayllou</option>
                  <option value="Tadjourah et peripherique">Tadjourah et périphérique</option>
                  <option value="Khor Angar">Khor Angar</option>
                  <option value="Allaili dada">Allaili dada</option>
                  <option value="Obock et peripherique">Obock et périphérique</option>
                </select>
              </div>
                )
              }
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quartier *
                </label>
                <input
                  type="text"
                  name="quartier"
                  value={householdData.quartier}
                  onChange={handleHouseholdInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Milieu de résidence *
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="milieu_residence"
                      value="urbain"
                      checked={householdData.milieu_residence === 'urbain'}
                      onChange={handleHouseholdInputChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Urbain</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="milieu_residence"
                      value="rural"
                      checked={householdData.milieu_residence === 'rural'}
                      onChange={handleHouseholdInputChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Rural</span>
                  </label>
                </div>
              </div>
              </div>

              <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taille du ménage *
                </label>
                <input
                  type="number"
                  name="taille_menage"
                  value={householdData.taille_menage}
                  onChange={handleHouseholdInputChange}
                  min="1"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone principal *
                </label>
                <input
                  type="tel"
                  name="telephone_1"
                  value={householdData.telephone_1}
                  onChange={handleHouseholdInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone secondaire
                </label>
                <input
                  type="tel"
                  name="telephone_2"
                  value={householdData.telephone_2}
                  onChange={handleHouseholdInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : (
                <>
                  Suivant
                  <ChevronRight size={18} className="ml-2" />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      )}

      {currentStep === 'housing' && (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onSubmit={handleHousingSubmit}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Home className="text-blue-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Informations sur le logement</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut d'occupation *
                </label>
                <select
                  name="statut_occupation"
                  value={housingData.statut_occupation}
                  onChange={handleHousingInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="Propriétaire avec titre foncier">Propriétaire avec titre foncier</option>
                  <option value="Propriétaire avec permis d'occupation provisoire">Propriétaire avec permis d'occupation provisoire</option>
                  <option value="Propriétaire sans titre">Propriétaire sans titre</option>
                  <option value="Copropriétaire">Copropriétaire</option>
                  <option value="Location">Location</option>
                  <option value="Sous-location">Sous-location</option>
                  <option value="Logement gratuit">Logement gratuit</option>
                  <option value="Logement de fonction">Logement de fonction</option>
                  <option value="Campement temporaire">Campement temporaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de logement *
                </label>
                <select
                  name="type_logement"
                  value={housingData.type_logement}
                  onChange={handleHousingInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Maison ordinaire">Maison ordinaire</option>
                  <option value="dans un immeuble">Appartement dans un immeuble</option>
                  <option value="Villa simple">Villa Simple</option>
                  <option value="Villa avec étage (duplex)">Villa avec étage (duplex)</option>
                  <option value="Locaux collectifs">Locaux collectifs</option>
                  <option value="Tukul/tente/kaolo">Toukoul/tente/kaolo</option>
                  <option value="Habitat spontané">Habitat spontané</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matériaux des murs *
                </label>
                <select
                  name="materiau_murs"
                  value={housingData.materiau_murs}
                  onChange={handleHousingInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un matériau</option>
                  <option value="Briques adobes (parpaing) en ciment<">Briques adobes (parpaing) en ciment</option>
                  <option value="Bois/Planche">Bois/Planche</option>
                  <option value="Briques et Bois">Briques et Bois</option>
                  <option value="Tôle et bois">Tôle et bois</option>
                  <option value="Pierre/madrépores">Pierre/madrépores</option>
                  <option value="Briques cuites">Briques cuites</option>
                  <option value="Paille">Paille</option>
                  <option value="Argile">Argile</option>
                  <option value="Matériaux de récupération">Matériaux de récupération</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matériaux du toit *
                </label>
                <select
                  name="materiau_toiture"
                  value={housingData.materiau_toiture}
                  onChange={handleHousingInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un matériau</option>
                  <option value="Tôle">Tôle</option>
                  <option value="Bois">Bois</option>
                  <option value="Béton">Béton</option>
                  <option value="Paille">Paille</option>
                  <option value="Tuile">Tuile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nature du sol *
                </label>
                <select
                  name="nature_sol"
                  value={housingData.nature_sol}
                  onChange={handleHousingInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Ciment">Ciment</option>
                  <option value="Carrelage">Carrelage</option>
                  <option value="Terre">Terre</option>
                  <option value="Planche">Planche</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source d'énergie pour la cuisson *
                </label>
                <select
                  name="source_energie_cuisson"
                  value={housingData.source_energie_cuisson}
                  onChange={handleHousingInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une source</option>
                  <option value="Pétrole (Kérosène)">Pétrole (Kérosène)</option>
                  <option value="Bois de chauffe/branchage">Bois de chauffe/branchage</option>
                  <option value="Charbon de bois">Charbon de bois</option>
                  <option value="Gaz butane">Gaz butane</option>
                  <option value="Électricité">Électricité</option>
                  <option value="Ne cuisine pas">Ne cuisine pas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source d'énergie pour l'éclairage *
                </label>
                <select
                  name="source_energie_eclairage"
                  value={housingData.source_energie_eclairage}
                  onChange={handleHousingInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une source</option>
                  <option value="Électricité (EDD)">Électricité (EDD)</option>
                  <option value="Pétrole lampant (Kérosène)">Pétrole lampant (Kérosène)</option>
                  <option value="Groupe électrogène">Groupe électrogène</option>
                  <option value="Panneaux solaire">Panneaux solaire</option>
                  <option value="Bois">Bois</option>
                  <option value="Bougie">Bougie</option>
                  <option value="Aucun éclairage">Aucun éclairage</option>
                  <option value="Torche">Torche</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source d'eau principale *
                </label>
                <select
                  name="source_eau"
                  value={housingData.source_eau}
                  onChange={handleHousingInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une source</option>
                  <option value="Eau courante (branchement intérieur ONEAD)">Eau courante (branchement intérieur ONEAD)</option>
                  <option value="Branchement extérieur ONEAD, par tuyau">Branchement extérieur ONEAD, par tuyau</option>
                  <option value="Fontaine publique">Fontaine publique</option>
                  <option value="Puits">Puits</option>
                  <option value="Rivière cours d'eaux de pluie">Rivière cours d'eaux de pluie</option>
                  <option value="Camion citerne">Camion citerne</option>
                </select>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="possede_toilletes"
                    checked={housingData.possede_toilletes}
                    onChange={handleHousingInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Le ménage possède des toilettes</span>
                </label>
              </div>

              {housingData.possede_toilletes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage des toilettes
                  </label>
                  <select
                    name="nature_usage_de_toilletes"
                    value={housingData.nature_usage_de_toilletes}
                    onChange={handleHousingInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                   
                  <option value="">Sélectionner le type d'usage</option>
                  <option value="Privé">Privé</option>
                  <option value="Partagé avec d'autres ménages">Partagé avec d'autres ménages</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setCurrentStep('household')}
              disabled={isSaving}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <ChevronLeft size={18} className="mr-2" />
              Précédent
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : (
                <>
                  Suivant
                  <ChevronRight size={18} className="ml-2" />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      )}

      {currentStep === 'equipment' && (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onSubmit={handleEquipmentSubmit}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Home className="text-blue-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Équipements du ménage</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Mobilier</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tables
                    </label>
                    <input
                      type="number"
                      name="table_count"
                      value={equipmentData.table_count}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Matelas
                    </label>
                    <input
                      type="number"
                      name="matelas"
                      value={equipmentData.matelas}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nattes
                    </label>
                    <input
                      type="number"
                      name="nattes"
                      value={equipmentData.nattes}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lits
                    </label>
                    <input
                      type="number"
                      name="lits"
                      value={equipmentData.lits}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chaises
                    </label>
                    <input
                      type="number"
                      name="chaises"
                      value={equipmentData.chaises}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Électronique</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Télévisions
                    </label>
                    <input
                      type="number"
                      name="televiseurs"
                      value={equipmentData.televiseurs}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Radios
                    </label>
                    <input
                      type="number"
                      name="radios"
                      value={equipmentData.radios}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ventilateurs
                    </label>
                    <input
                      type="number"
                      name="ventilateurs"
                      value={equipmentData.ventilateurs}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Climatiseurs
                    </label>
                    <input
                      type="number"
                      name="climatiseur"
                      value={equipmentData.climatiseur}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Réfrigérateurs
                    </label>
                    <input
                      type="number"
                      name="refrigerateur"
                      value={equipmentData.refrigerateur}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Transport</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vélos
                    </label>
                    <input
                      type="number"
                      name="bicyclette"
                      value={equipmentData.bicyclette}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motos
                    </label>
                    <input
                      type="number"
                      name="motocyclette"
                      value={equipmentData.motocyclette}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voitures
                    </label>
                    <input
                      type="number"
                      name="vehicule"
                      value={equipmentData.vehicule}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Élevage</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bovins
                    </label>
                    <input
                      type="number"
                      name="bovins"
                      value={equipmentData.bovins}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ovins
                    </label>
                    <input
                      type="number"
                      name="ovins"
                      value={equipmentData.ovins}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chameaux
                    </label>
                    <input
                      type="number"
                      name="camelins"
                      value={equipmentData.camelins}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volailles
                    </label>
                    <input
                      type="number"
                      name="volailles"
                      value={equipmentData.volailles}
                      onChange={handleEquipmentInputChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setCurrentStep('housing')}
              disabled={isSaving}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <ChevronLeft size={18} className="mr-2" />
              Précédent
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : (
                <>
                  <Save size={18} className="mr-2" />
                  Enregistrer
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      )}
       {currentStep === 'complaints' && (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onSubmit={handleComplaintSubmit}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <AlertCircle className="text-blue-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Doléances</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie de plainte *
                </label>
                <select
                  name="categorie_plainte"
                  value={complaintData.categorie_plainte}
                  onChange={handleComplaintInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Enquete sociale">Enquête sociale</option>
                  <option value="Enrolement biometrique">Enrôlement biométrique</option>
                  <option value="Demande de prestation sociale">Demande de prestation sociale</option>
                  <option value="Non-Respect du plan d'amenagement prevu">Non-Respect du plan d'aménagement prévu</option>
                  <option value="Non conforme aux normes de construction">Non conforme aux normes de construction</option>
                  <option value="Environnement">Environnement</option>
                  <option value="Divers">Divers</option>
                  <option value="Plaintes sensibles">Plaintes sensibles</option>
                  <option value="Revendications de droit">Revendications de droit</option>
                  <option value="Autres categories">Autres catégories</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de plainte *
                </label>
                <select
                  name="type_de_plainte"
                  value={complaintData.type_de_plainte}
                  onChange={handleComplaintInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Menage non enquete">Ménage non enquêté</option>
                  <option value="Menage non enrole">Ménage non enrôlé</option>
                  <option value="Inclusion a un programme">Inclusion à un programme</option>
                  <option value="Menage enquete mais s'estime etre pauvre">Ménage enquêté mais s'estime être pauvre</option>
                  <option value="Autres plaintes de l'enquete sociale">Autres plaintes de l'enquête sociale</option>
                  <option value="Membre du menage non enrole">Membre(s) du ménage non enrôlé</option>
                  <option value="Autre plainte de l'enrolement biometrique">Autre plainte de l'enrôlement biométrique</option>
                  <option value="Exclusion a un programme">Exclusion à un programme</option>
                  <option value="Appui sante pour les membres">Appui santé pour le(s) membres du ménage</option>
                  <option value="Appui education">Appui éducation</option>
                  <option value="Appui alimentaire">Appui alimentaire</option>
                  <option value="Appui en logement">Appui en logement</option>
                  <option value="Demande d'emploi">Demande d'emploi</option>
                  <option value="Appui a l'alimentation en eau">Appui à l'alimentation en eau (ONEAD ou autres)</option>
                  <option value="Appui au branchement d'electricite">Appui au branchement d'électricité (EDD)</option>
                  <option value="Appui a l'acces au financement">Appui à l'accès au financement pour un projet</option>
                  <option value="Autre demande d'assistance sociale">Autre demande d'assistance sociale</option>
                  <option value="Appui sante pour une peronne age">Appui santé pour une personne âgée</option>
                  <option value="Appui sante pour une peronne handicape">Appui santé pour une personne handicapée</option>
                  <option value="Appui sante pour une peronne vulnerable">Appui santé pour une personne vulnérable</option>
                  <option value="Formation professionnelle">Formation professionnelle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description de la plainte *
                </label>
                <textarea
                  name="description_plainte"
                  value={complaintData.description_plainte}
                  onChange={handleComplaintInputChange}
                  required
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Décrivez la plainte..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setCurrentStep('equipment')}
              disabled={isSaving}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <ChevronLeft size={18} className="mr-2" />
              Précédent
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : (
                <>
                  <Save size={18} className="mr-2" />
                  Enregistrer
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default NewHousehold;