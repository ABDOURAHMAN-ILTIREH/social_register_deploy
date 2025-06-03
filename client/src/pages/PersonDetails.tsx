import React,{useEffect,useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Edit, Trash, User, Calendar, Briefcase, 
  GraduationCap, Heart, FileText, Home 
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { Menage, Personne } from '../types/database';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const PersonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {deletePersonne } = useData();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [person, setPerson] = useState<Personne | null>(null);
  const [household, setMenages] = useState<Menage | null>(null);
  const {isAdmin} = useAuth();
  
  if (!id) return <div>Identifiant manquant</div>;
 
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        if (!id) {
          throw new Error('No ID provided');
        }
        
        const data = await api.getPerson<Personne>(id);
        const datas = await api.getHousehold<Menage>(data?.menage_id.toString());
        setPerson(data);
        setMenages(datas);
      } catch (err) {
        err instanceof Error ? err.message : 'Failed to fetch person';
      } 
    };
   
    fetchPerson();
  }, [id]);

  if (!person) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Personne non trouvée</h2>
        <Link to="/households" className="text-blue-600 hover:text-blue-800">
          Retour à la liste des ménages
        </Link>
      </div>
    );
  }
  
  const handleDelete = async () => {
    await deletePersonne(parseInt(id));
    navigate(`/households/${person.menage_id}`);
  };

 const DetailItem = ({ label, value, icon: Icon }: { label: string, value: string | number | undefined, icon?: React.ComponentType<{ size?: number }> }) => (
  <div className="flex items-center py-3 border-b border-gray-100">
    {Icon && (
      <div className="mr-3 p-2 bg-gray-50 rounded-full">
        <Icon size={18}/>
      </div>
    )}
    <div className="flex-1 flex items-baseline">
      <p className="w-1/3 text-sm font-medium text-gray-500">{label}</p>
      <p className="w-2/3 text-gray-800">{value || 'Non spécifié'}</p>
    </div>
  </div>
);

  const SectionHeader = ({ title, icon: Icon }: { title: string, icon: React.ComponentType<{ size?: number }> }) => (
    <div className="flex items-center mt-6 mb-4">
      <Icon size={20} />
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <Link 
          to={`/households/${person.menage_id}`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Retour au ménage</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`h-2 ${person.sexe === 'Masculin' ? 'bg-blue-500' : 'bg-pink-500'}`} />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                person.sexe === 'Masculin' ? 'bg-blue-100' : 'bg-pink-100'
              }`}>
                <User size={24} className={person.sexe === 'Masculin' ? 'text-blue-600' : 'text-pink-600'} />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-800">{person.nom_prenoms}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    person.sexe === 'Masculin' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                  }`}>
                    {person.sexe}
                  </span>
                  <span className="text-gray-500">{person.age} ans</span>
                  {person.lien_parental && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {person.lien_parental}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isAdmin &&(

                <><motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/persons/${id}/edit`)}
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

          {/* Informations personnelles */}
          <SectionHeader title="Informations personnelles" icon={User} />
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailItem 
              label="Nom complet" 
              value={person.nom_prenoms} 
            />
            <DetailItem 
              label="Sexe" 
              value={person.sexe} 
            />
            <DetailItem 
              label="Âge" 
              value={`${person.age} ans`} 
            />
            <DetailItem 
              label="Date de naissance" 
              value={new Date(person.date_naissance).toLocaleDateString()} 
              icon={Calendar}
            />
            <DetailItem 
              label="État matrimonial" 
              value={person.etat_matrimonial} 
            />
            {person.enceinte && (
              <DetailItem 
                label="État de grossesse" 
                value="Enceinte" 
              />
            )}
          </div>

          {/* Documents d'identité */}
          <SectionHeader title="Documents d'identité" icon={FileText} />
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailItem 
              label="Type de pièce" 
              value={person.piece_identite} 
            />
            <DetailItem 
              label="Numéro d'identité" 
              value={person.numero_identite} 
            />
          </div>

          {/* Éducation */}
          <SectionHeader title="Éducation" icon={GraduationCap} />
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailItem 
              label="Scolarisation" 
              value={person.scolarisation} 
            />
            <DetailItem 
              label="Niveau d'instruction" 
              value={person.niveau_instruction} 
            />
          </div>

          {/* Emploi */}
          <SectionHeader title="Emploi" icon={Briefcase} />
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailItem 
              label="Statut d'occupation" 
              value={person.statut_occupation} 
            />
            {person.statut_occupation === 'Occupé(e)' && (
              <>
                <DetailItem 
                  label="Statut dans l'emploi" 
                  value={person.statut_emploi} 
                />
                <DetailItem 
                  label="Activité principale" 
                  value={person.activite_principale} 
                />
              </>
            )}
          </div>

          {/* Situation particulière */}
          {(person.handicape || person.orphelin) && (
            <>
              <SectionHeader title="Situation particulière" icon={Heart} />
              <div className="bg-gray-50 rounded-lg p-4">
                {person.handicape && (
                  <>
                    <DetailItem 
                      label="Handicap" 
                      value="Personne en situation de handicap" 
                    />
                    {person.membre_oragane_handicape && (
                      <DetailItem 
                        label="Membre organe handicapé" 
                        value={person.membre_oragane_handicape} 
                      />
                    )}
                    {person.numero_carte_handicap && (
                      <DetailItem 
                        label="Numéro carte handicap" 
                        value={person.numero_carte_handicap} 
                      />
                    )}
                  </>
                )}
                {person.orphelin && (
                  <>
                    <DetailItem 
                      label="Orphelin" 
                      value="Oui" 
                    />
                    {person.orphelin_du_quelle_parents && (
                      <DetailItem 
                        label="Orphelin de" 
                        value={person.orphelin_du_quelle_parents} 
                      />
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* Ménage */}
          {household && (
            <>
              <SectionHeader title="Ménage" icon={Home} />
              <Link 
                to={`/households/${person.menage_id}`}
                className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ménage #{person.menage_id}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {household.commune_residence}, {household.quartier}
                    </p>
                  </div>
                  <ChevronLeft size={20} className="text-gray-400 transform rotate-180" />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer la personne"
        message="Êtes-vous sûr de vouloir supprimer cette personne ? Cette action est irréversible."
      />
    </div>
  );
};

export default PersonDetails;