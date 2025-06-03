import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Interviews: React.FC = () => {
  const { entretiens, menages, enqueteurs } = useData();
  const [selectedEnqueteur, setSelectedEnqueteur] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const filteredEntretiens = useMemo(() => {
    let filtered = [...entretiens];

    // Filter by interviewer
    if (selectedEnqueteur) {
      filtered = filtered.filter(entretien => entretien.enqueteur_id === parseInt(selectedEnqueteur));
    }

    // Filter by date
    if (searchDate) {
      filtered = filtered.filter(entretien => {
        const menage = menages.find(m => m.id === entretien.menage_id);
        return menage?.date_entretien === searchDate;
      });
    }

    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = menages.find(m => m.id === a.menage_id)?.date_entretien || '';
      const dateB = menages.find(m => m.id === b.menage_id)?.date_entretien || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [entretiens, menages, selectedEnqueteur, searchDate]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Entretiens</h1>
        <p className="text-gray-600">Liste des entretiens réalisés</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="searchEnqueteur" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par enquêteur
            </label>
            <div className="relative">
              <select
                id="searchEnqueteur"
                value={selectedEnqueteur}
                onChange={(e) => setSelectedEnqueteur(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les enquêteurs</option>
                {enqueteurs.map(enqueteur => (
                  <option key={enqueteur.id} value={enqueteur.id}>
                    {enqueteur.nom} - {enqueteur.guichet_social}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="searchDate" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par date
            </label>
            <div className="relative">
              <input
                type="date"
                id="searchDate"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Entretien
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enquêteur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ménage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntretiens.map((entretien) => {
                const menage = menages.find(m => m.id === entretien.menage_id);
                const enqueteur = enqueteurs.find(e => e.id === entretien.enqueteur_id);
                
                if (!menage || !enqueteur) return null;

                return (
                  <motion.tr 
                    key={entretien.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{entretien.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(menage.date_entretien).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {enqueteur.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enqueteur.guichet_social}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Ménage #{menage.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {menage.commune_residence}, {menage.quartier}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        menage.resultat_interview === 'Complété' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {menage.resultat_interview}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Interviews;