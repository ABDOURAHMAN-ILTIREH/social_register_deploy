import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Filter, Search, MapPin, Phone, Calendar, Users,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useUi } from '../contexts/UiContext';
import { useAuth } from '../contexts/AuthContext';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

const Households: React.FC = () => {
  const navigate = useNavigate();
  const { menages } = useData();
  const { searchQuery, setSearchQuery } = useUi();
  const [residenceFilter, setResidenceFilter] = useState<'all' | 'Urbain' | 'Rural'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {isAdmin} = useAuth();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [menages.length]);

  const filteredMenages = useMemo(() => {
    let result = menages;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(menage =>
        menage.commune_residence.toLowerCase().includes(query) ||
        menage.quartier.toLowerCase().includes(query) ||
        menage.telephone_1.includes(query) ||
        (menage.telephone_2 && menage.telephone_2.includes(query))
      );
    }

    if (residenceFilter !== 'all') {
      result = result.filter(menage => menage.milieu_residence === residenceFilter);
    }

    return result;
  }, [menages, searchQuery, residenceFilter]);

  const totalPages = Math.ceil(filteredMenages.length / pageSize);
  const paginatedMenages = filteredMenages.slice(
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ménages</h1>
          <p className="text-gray-600">Gestion des ménages enregistrés</p>
        </div>
          {isAdmin && (

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/households/new')}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              <span>Nouveau ménage</span>
            </motion.button>

          )}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par commune, quartier, téléphone..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Filter size={18} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Filtrer:</span>
            </div>

            <select
              value={residenceFilter}
              onChange={(e) => setResidenceFilter(e.target.value as 'all' | 'Urbain' | 'Rural')}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">Tous</option>
              <option value="Urbain">Urbain</option>
              <option value="Rural">Rural</option>
            </select>
          </div>
        </div>
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
                  Entretien
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

        {filteredMenages.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun ménage trouvé
            </h3>
            <p className="text-gray-500 mb-6">
              Aucun ménage ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setResidenceFilter('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Réinitialiser les filtres
            </button>
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
                    {Math.min(currentPage * pageSize, filteredMenages.length)} sur{' '}
                    {filteredMenages.length} ménages
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
  );
};

export default Households;