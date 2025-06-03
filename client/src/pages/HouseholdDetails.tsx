import React, { useState ,useEffect} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Users, Phone, Home, MapPin, FileText, Calendar, Globe, Edit, Trash, UserPlus,
  Lightbulb, Flame, Droplet, Building2
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
// import PersonCard from '../components/PersonCard';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ComplaintsList from '../components/ComplaintsList';
import { Menage, Personne } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'menage' | 'personnes' | 'logement' | 'equipement' | 'plaintes';

const HouseholdDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
 const { isAdmin } = useAuth();
  const [menageData, setMenageData] = useState<{
    menage: Menage;
    membres: any; // optional, or better typed
    members: Personne[];
} | null>(null);


  const navigate = useNavigate();
  const {getHouseholdMembers, logements, equipements, deleteMenage } = useData();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('menage');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const numericId = String(id);
        const response = await getHouseholdMembers(numericId);

       setMenageData({
        menage: response.menage,
        membres: null, // or response.membres if exists
        members: response.members  // ✅ correct nesting
      });

      } catch (err) {
        throw err
      }
    };

    fetchData();
  }, [id, getHouseholdMembers]);

  if (!id) return <div>Identifiant manquant</div>;
  

  
  const logement = logements.find((l: { menage_id: number; }) => l.menage_id === parseInt(id));
  const equipement = equipements.find((e: { menage_id: number; }) => e.menage_id === parseInt(id));
  
  if (!menageData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ménage non trouvé</h2>
        <Link to="/households" className="text-blue-600 hover:text-blue-800">
          Retour à la liste des ménages
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteMenage(parseInt(id));
    navigate('/households');
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'menage', label: 'Ménage', icon: <Home size={20} /> },
    { id: 'personnes', label: 'Personnes', icon: <Users size={20} /> },
    { id: 'logement', label: 'Logement', icon: <Building2 size={20} /> },
    { id: 'equipement', label: 'Équipement', icon: <FileText size={20} /> },
    { id: 'plaintes', label: 'Plaintes', icon: <FileText size={20} /> },
  ];

  const equipmentCategories = [
    {
      title: "Mobilier",
      items: [
        { key: 'table_count', label: 'Tables' },
        { key: 'matelas', label: 'Matelas' },
        { key: 'mattes', label: 'Nattes' },
        { key: 'lits', label: 'Lits' },
        { key: 'chaises', label: 'Chaises' }
      ]
    },
    {
      title: "Électronique",
      items: [
        { key: 'televiseurs', label: 'Télévisions' },
        { key: 'radios', label: 'Radios' },
        { key: 'ventilateurs', label: 'Ventilateurs' },
        { key: 'climatiseurs', label: 'climatiseurs' },
        { key: 'telephone_mobile', label: 'Téléphones mobiles' },
        { key: 'ordinateur', label: 'ordinateur' },
        { key: 'machine_a_laver', label: 'machine_a_laver' }
      ]
    },
    {
      title: "Transport",
      items: [
        { key: 'bicycles', label: 'Vélos' },
        { key: 'motorcycles', label: 'Motos' },
        { key: 'vehicule', label: 'Voitures' }
      ]
    },
    {
      title: "Élevage",
      items: [
        { key: 'bovins', label: 'Bovins' },
        { key: 'ovins', label: 'Ovins' },
        { key: 'camelins', label: 'Chameaux' },
        { key: 'volailles', label: 'Volailles' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/households" className="flex items-center text-blue-600 hover:text-blue-800">
          <ChevronLeft size={20} />
          <span className="ml-1">Retour à la liste</span>
        </Link>
        <div className="flex items-center space-x-2">
            {isAdmin && ( 
                <><motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/households/${id}/edit`)}
              className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Edit size={18} />
            </motion.button><motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
                <Trash size={18} />
              </motion.button></>


            )}

        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Ménage #{menageData?.menage.id}
              </h1>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin size={16} className="mr-1" />
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${menageData?.menage.milieu_residence === 'Urbain' ? 'bg-blue-600' : 'bg-green-600'}`}></span>
                <span>{menageData?.menage.milieu_residence}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'menage' && (
                <motion.div
                  key="menage"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <Calendar size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date d'entretien</p>
                          <p className="font-medium">
                            {new Date(menageData.menage.date_entretien).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <FileText size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Résultat de l'interview</p>
                          <p className="font-medium">{menageData.menage.resultat_interview}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Langue: {menageData.menage.langue_interview}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Taille du ménage</p>
                          <p className="font-medium">{menageData.menage.taille_menage} personnes</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <Phone size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium">{menageData.menage.telephone_1}</p>
                          {menageData.menage.telephone_2 && (
                            <p className="text-sm text-gray-500 mt-1">
                              {menageData.menage.telephone_2} (secondaire)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Localisation</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <Globe size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Région de provenance</p>
                          <p className="font-medium">{menageData.menage.region_provenance}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <MapPin size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Commune de résidence</p>
                          <p className="font-medium">{menageData.menage.commune_residence}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Arrondissement: {menageData.menage.arrondissement}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Quartier: {menageData.menage.quartier}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <Home size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Logement</p>
                          <p className="font-medium">
                            {logement?.type_logement || 'Non spécifié'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Statut: {logement?.statut_occupation || 'Non spécifié'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Source d'eau: {logement?.source_eau || 'Non spécifié'}
                          </p>
                        
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'personnes' && (
                <motion.div
                  key="personnes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Membres du ménage</h3>
                      {isAdmin && ( 

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/households/${id}/persons/new`)}
                          className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <UserPlus size={16} className="mr-1" />
                          <span className="text-sm">Ajouter</span>
                        </motion.button>

                      )}
                  </div>

                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nom et prénoms
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sexe / Âge
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lien
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              État civil
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Occupation
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {menageData?.members.map((personne:Personne) =>(
                            <tr key={personne.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {personne.nom_prenoms}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    personne.sexe === 'Masculin' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                                  }`}>
                                    {personne.sexe === 'Masculin' ? 'Masculin' : 'Féminin'}
                                  </span>
                                  <span className="ml-2 text-sm text-gray-500">{personne.age} ans</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {personne.lien_parental}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {personne.etat_matrimonial}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{personne.statut_occupation}</div>
                                {personne.activite_principale && (
                                  <div className="text-sm text-gray-500">{personne.activite_principale}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  to={`/persons/${personne.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Voir détails
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {menageData.members.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Aucun membre enregistré</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'logement' && (
                <motion.div
                  key="logement"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Informations sur le logement</h3>
                  
                  {logement ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-4">Caractéristiques principales</h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500">Type de logement</p>
                                <p className="font-medium">{logement.type_logement}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Home className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500">Statut d'occupation</p>
                                <p className="font-medium">{logement.statut_occupation}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-4">Construction</h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500">Matériaux des murs</p>
                              <p className="font-medium">{logement.materiau_murs}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Matériaux du toit</p>
                              <p className="font-medium">{logement.materiau_toiture}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Nature du sol</p>
                              <p className="font-medium">{logement.nature_sol}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-4">Énergie et services</h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Flame className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500">Énergie pour la cuisson</p>
                                <p className="font-medium">{logement.source_energie_cuisson}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Lightbulb className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500">Énergie pour l'éclairage</p>
                                <p className="font-medium">{logement.source_energie_eclairage}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Droplet className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500">Source d'eau</p>
                                <p className="font-medium">{logement.source_eau}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-4">Installations sanitaires</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  logement.possede_toilletes 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {logement.possede_toilletes ? 'Possède des toilettes' : 'Pas de toilettes'}
                                </span>
                              </div>
                              {logement.possede_toilletes && logement.nature_usage_de_toilletes && (
                                <p className="text-sm text-gray-500 mt-2">
                                  Usage: {logement.nature_usage_de_toilletes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Aucune information sur le logement
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'equipement' && (
                <motion.div
                  key="equipement"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Équipements et biens</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {equipmentCategories.map(category => (
                      <div key={category.title} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-medium text-gray-700 mb-3">{category.title}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {category.items.map(item => {
                            const value = equipement?.[item.key as keyof typeof equipement] || 0;
                            if (value === 0) return null;
                            
                            return (
                              <div key={item.key} className="flex justify-between items-center bg-white p-2 rounded-md">
                                <span className="text-sm text-gray-600">{item.label}</span>
                                <span className="text-sm font-medium">{value}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'plaintes' && (
                <motion.div
                  key="plaintes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ComplaintsList menageId={parseInt(id)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le ménage"
        message="Êtes-vous sûr de vouloir supprimer ce ménage ? Cette action est irréversible et supprimera également toutes les données associées (membres, logement, équipements)."
      />
    </div>
  );
};

export default HouseholdDetails;