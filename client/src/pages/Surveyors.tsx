import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, MapPin, Plus, X, Edit, Trash } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ConfirmationDialog from '../components/ConfirmationDialog';

const Surveyors: React.FC = () => {
  const { enqueteurs, entretiens, menages, addEnqueteur, updateEnqueteur, deleteEnqueteur } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSurveyorId, setSelectedSurveyorId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    guichet_social: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (enqueteur: { id: number; nom: string; guichet_social: string }) => {
    setEditingId(enqueteur.id);
    setFormData({
      nom: enqueteur.nom,
      guichet_social: enqueteur.guichet_social
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setSelectedSurveyorId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSurveyorId) {
      try {
        await deleteEnqueteur(selectedSurveyorId);
        setIsDeleteDialogOpen(false);
        setSelectedSurveyorId(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (editingId) {
        await updateEnqueteur({
          id: editingId,
          ...formData
        });
      } else {
        await addEnqueteur(formData);
      }
      setShowForm(false);
      setFormData({ nom: '', guichet_social: '' });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Enquêteurs</h1>
          <p className="text-gray-600">Liste des enquêteurs et leurs entretiens</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingId(null);
            setFormData({ nom: '', guichet_social: '' });
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Nouvel enquêteur
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Modifier l\'enquêteur' : 'Nouvel enquêteur'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom et prénom de l'enquêteur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guichet social *
              </label>
              <input
                type="text"
                name="guichet_social"
                value={formData.guichet_social}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom du guichet social"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Enregistrement...' : editingId ? 'Modifier' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enquêteur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guichet social
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entretiens réalisés
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier entretien
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zones couvertes
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enqueteurs.map((enqueteur) => {
                const enqueteurEntretiens = entretiens.filter(e => e.enqueteur_id === enqueteur.id);
                const lastInterview = enqueteurEntretiens.length > 0 
                  ? menages.find(m => m.id === enqueteurEntretiens[enqueteurEntretiens.length - 1].menage_id)
                  : null;
                
                const zones = new Set(
                  enqueteurEntretiens
                    .map(e => menages.find(m => m.id === e.menage_id))
                    .filter(Boolean)
                    .map(m => m?.commune_residence)
                );

                return (
                  <motion.tr 
                    key={enqueteur.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {enqueteur.nom}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{enqueteur.guichet_social}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{enqueteurEntretiens.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lastInterview ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(lastInterview.date_entretien).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Aucun entretien</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {Array.from(zones).map((zone, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            {zone}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(enqueteur)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(enqueteur.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                        >
                          <Trash size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'enquêteur"
        message="Êtes-vous sûr de vouloir supprimer cet enquêteur ? Cette action est irréversible."
      />
    </div>
  );
};

export default Surveyors;