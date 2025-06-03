import { motion } from 'framer-motion';
import { AlertCircle, MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface ComplaintsListProps {
  menageId: number;
}

const ComplaintsList: React.FC<ComplaintsListProps> = ({ menageId }) => {
  const { plaintes } = useData();

  const menagePlaintes = plaintes.filter(p => p.menage_id === menageId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <AlertCircle className="text-red-600 mr-2" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Plaintes</h2>
        </div>
      </div>

    

      {menagePlaintes.length > 0 ? (
        <div className="space-y-4">
          {menagePlaintes.map((plainte) => (
            <motion.div
              key={plainte.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <MessageCircle size={16} className="text-gray-400 mr-2" />
                  <span className="font-medium text-gray-800">
                    {plainte.categorie_plainte}
                  </span>
                </div>
                <p className={`px-2 py-1 rounded-full bg-gray-300  text-xs font-medium`}>
                type de plaintes :
                  <span className={`text-xs font-medium text-black ml-2`}>{plainte.type_de_plainte}</span>
                </p>
              </div>
              
              <p className="mt-2 text-gray-600 text-sm">
                {plainte.description_plainte}
              </p>
              
              <div className="mt-2 text-xs text-gray-500">
                {new Date(plainte.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          Aucune plainte enregistrée
        </div>
      )}
    </div>
  );
};

export default ComplaintsList;