import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, User, Calendar, FileText, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Filter, X, Loader2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL;

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

interface Person {
  id: number;
  nom_prenoms: string;
  sexe: string;
  age: number;
  lien_parental: string;
  etat_matrimonial: string;
  piece_identite: string;
  numero_identite: string;
  enceinte: boolean;
  orphelin: boolean;
  scolarisation: string;
  niveau_instruction: string;
  statut_occupation: string;
  handicape: boolean;
  menage_id: number;
}

const Persons: React.FC = () => {
  const [personnes, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sexe: '',
    ageMin: '',
    ageMax: '',
    lien_parental: '',
    etat_matrimonial: '',
    piece_identite: '',
    numero_identite: '',
    enceinte: '',
    orphelin: '',
    scolarisation: '',
    niveau_instruction: '',
    statut_occupation: '',
    handicape: ''
  });

 const fetchData = async () => {
  try {
    setLoading(true);
    setError('');
    
    // Build query params
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('limit', pageSize.toString());
    
    if (searchQuery) params.append('nom_prenoms', searchQuery);
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') params.append(key, value);
    });

    const response = await fetch(`${API_BASE}/personnesQuery?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Need to parse the JSON response
    
    setPersons(data.data); // Access data from parsed response
    setTotalCount(data.pagination.totalItems); // Access pagination from parsed response

  } catch (err) {
    setError('Erreur lors du chargement des données');
    console.error('Fetch error:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      sexe: '',
      ageMin: '',
      ageMax: '',
      lien_parental: '',
      etat_matrimonial: '',
      piece_identite: '',
      numero_identite: '',
      enceinte: '',
      orphelin: '',
      scolarisation: '',
      niveau_instruction: '',
      statut_occupation: '',
      handicape: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(Math.ceil(totalCount / pageSize));
  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalCount / pageSize)));

  // Options for select filters
  const sexeOptions = ['Masculin', 'Féminin'];
  const lienParentalOptions = [
    'chef de ménage', 'conjoint du chef de menage', 'Père ou mère CM', 
    'Fils ou Fille CM', 'Gendre ou belle fille', 'Petit-fils ou petite-fille',
    'oncle ou tante', 'Frère ou soeur', 'Beau-fils ou belle-fille',
    'Beau-père ou belle-mère', 'Neveu ou nièce', 'Cousin ou cousine',
    'Enfant adopté', 'Autres parents', 'Sans parent'
  ];
  const booleanOptions = [
    { value: '', label: 'Tous' },
    { value: 'true', label: 'Oui' },
    { value: 'false', label: 'Non' }
  ];

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Personnes</h1>
        <p className="text-gray-600">Liste des personnes enregistrées</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, ID ou numéro d'identité"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            <Filter size={18} />
            <span>Filtres</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Sexe Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
              <select
                name="sexe"
                value={filters.sexe}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
              >
                <option value="">Tous</option>
                {sexeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Age Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="ageMin"
                  placeholder="Min"
                  value={filters.ageMin}
                  onChange={handleFilterChange}
                  className="w-1/2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
                />
                <input
                  type="number"
                  name="ageMax"
                  placeholder="Max"
                  value={filters.ageMax}
                  onChange={handleFilterChange}
                  className="w-1/2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
                />
              </div>
            </div>

            {/* Lien Parental Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lien parental</label>
              <select
                name="lien_parental"
                value={filters.lien_parental}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
              >
                <option value="">Tous</option>
                {lienParentalOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Piece Identite Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pièce d'identité</label>
              <input
                type="text"
                name="piece_identite"
                placeholder="Type de pièce"
                value={filters.piece_identite}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
              />
            </div>

            {/* Numero Identite Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'identité</label>
              <input
                type="text"
                name="numero_identite"
                placeholder="Numéro de pièce"
                value={filters.numero_identite}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
              />
            </div>

            {/* Statut Occupation Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut occupation</label>
              <input
                type="text"
                name="statut_occupation"
                placeholder="Statut occupation"
                value={filters.statut_occupation}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
              />
            </div>

            {/* Boolean Filters Row */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enceinte</label>
              <select
                name="enceinte"
                value={filters.enceinte}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
              >
                {booleanOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orphelin</label>
              <select
                name="orphelin"
                value={filters.orphelin}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
              >
                {booleanOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Handicapé</label>
              <select
                name="handicape"
                value={filters.handicape}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2"
              >
                {booleanOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <X size={16} />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : personnes.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune personne trouvée
            </h3>
            <p className="text-gray-500">
              Aucune personne ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personne
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Âge / Sexe
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Identité
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
                  {personnes.map((person) => {
                    return (
                      <motion.tr
                        key={person.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {person.nom_prenoms}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {person.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <span className="text-sm text-gray-900">{person.age} ans</span>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                person.sexe === 'Masculin' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-pink-100 text-pink-800'
                              }`}>
                                {person.sexe === 'Masculin' ? 'Masculin' : 'Féminin'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">{person.piece_identite}</div>
                              {person.numero_identite && (
                                <div className="text-sm text-gray-500">{person.numero_identite}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                          <Link
                            to={`/persons/${person.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Voir détails
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

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
                      {Math.min(currentPage * pageSize, totalCount)} sur{' '}
                      {totalCount} personnes
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
          </>
        )}
      </div>
    </div>
  );
};

export default Persons;