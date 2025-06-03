import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, Users, Map, Building2, UserCheck, 
  Calendar, MapPin, Phone, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import StatCard from '../components/StatCard';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

const Dashboard: React.FC = () => {
 
  const { menages, personnes } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  const stats = useMemo(() => {
    const urbanCount = menages.filter(m => m.milieu_residence === 'urbain').length;
    const ruralCount = menages.filter(m => m.milieu_residence === 'rural').length;
    const withIdCount = menages.filter(m => m.arrondissement).length;
    const completedCount = menages.filter(m => m.resultat_interview === 'Complété').length;

    return {
      totalMenages: menages.length,
      totalPersonnes: personnes.length,
      urbanCount,
      ruralCount,
      withIdCount,
      completedCount
    };
  }, [menages, personnes]);

  const sortedMenages = useMemo(() => {
    return [...menages]
      .sort((a, b) => new Date(b.date_entretien).getTime() - new Date(a.date_entretien).getTime());
  }, [menages]);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [menages.length]);

  const totalPages = Math.ceil(sortedMenages.length / pageSize);
  const paginatedMenages = sortedMenages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble des enrôlements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total des ménages" 
          value={stats.totalMenages} 
          icon={<Home size={24} className="text-white" />} 
          color="bg-blue-500"
        />
        
        <StatCard 
          title="Total des personnes" 
          value={stats.totalPersonnes} 
          icon={<Users size={24} className="text-white" />} 
          color="bg-green-500"
        />
        
        <StatCard 
          title="Ménages urbains" 
          value={stats.urbanCount} 
          icon={<Building2 size={24} className="text-white" />} 
          color="bg-violet-500"
        />
        
        <StatCard 
          title="Ménages ruraux" 
          value={stats.ruralCount} 
          icon={<Map size={24} className="text-white" />} 
          color="bg-amber-500"
        />

        <StatCard 
          title="Entretiens complétés" 
          value={stats.completedCount} 
          icon={<UserCheck size={24} className="text-white" />} 
          color="bg-emerald-500"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Ménages récents</h2>
          <Link
            to="/households"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Voir tous les ménages →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ménage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'entretien
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMenages.map((menage) => (
                  <motion.tr
                    key={menage.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Ménage #{menage.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {menage.taille_menage} personnes
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div className="text-sm text-gray-900">{menage.commune_residence}</div>
                          <div className="text-sm text-gray-500">{menage.quartier}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div className="text-sm text-gray-900">{menage.telephone_1}</div>
                          {menage.telephone_2 && (
                            <div className="text-sm text-gray-500">{menage.telephone_2}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <div className="text-sm text-gray-900">
                          {new Date(menage.date_entretien).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        menage.milieu_residence === 'Urbain'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {menage.milieu_residence}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/households/${menage.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir détails
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedMenages.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun ménage trouvé
              </h3>
              <p className="text-gray-500">
                Aucun ménage n'a été enregistré pour le moment.
              </p>
            </div>
          ) : (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Afficher</span>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-700">éléments par page</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      {(currentPage - 1) * pageSize + 1} à{' '}
                      {Math.min(currentPage * pageSize, sortedMenages.length)} sur{' '}
                      {sortedMenages.length} ménages
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={handleFirstPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Première page"
                    >
                      <ChevronsLeft size={16} />
                    </button>
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Page précédente"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Page suivante"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={handleLastPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Dernière page"
                    >
                      <ChevronsRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;