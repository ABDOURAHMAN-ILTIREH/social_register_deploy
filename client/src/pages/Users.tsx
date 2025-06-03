import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users as UsersIcon, Search, Shield, Mail, UserCheck, Trash, Edit, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ConfirmationDialog from '../components/ConfirmationDialog';

const Users: React.FC = () => {
  const { users,deleteUsers,updateUsers} = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUsersId, setSelectedUsersId] = useState<number | null>(null);
 
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
     name: "",
     email: "",
     role: "",
  });

  const handleEdit = (users: {id: number; name:string,email:string,role:string,password: string;
}) => {
    setEditingId(users.id);
    setFormData({
      name: users.name,
      email: users.email,
      role:users.role,
    });
    setShowForm(true);
  };

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
   };
   const handleHouseholdInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
       const { name, value, type } = e.target;
       setFormData(prev => ({
         ...prev,
         [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
       }));
     };
   


   const handleDelete = (id: number) => {
    setSelectedUsersId(id);
    setIsDeleteDialogOpen(true);
  };

  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      try {
       if (editingId !== null) {
              await updateUsers({
                id: editingId,
                ...formData,
                password: '',
              });
            }

        setShowForm(false);
        setFormData({  name:'',email:'',role:''});
        setEditingId(null);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'enregistrement');
      }
    };
  const confirmDelete = async () => {
    if (selectedUsersId) {
      try {
        await deleteUsers(selectedUsersId);
        setIsDeleteDialogOpen(false);
        setSelectedUsersId(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression');
      }
    }
  };

  const filteredUsers = users.filter((user: { name: string; email: string ;role:string}) => {
  const query = searchQuery.toLowerCase().trim();
  return (
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Utilisateurs</h1>
        <p className="text-gray-600">Gestion des utilisateurs du système</p>
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
              Modifier l'utilisateur 
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
                name *
              </label>
              <input
                type="text"
                name="name"
                onChange={handleInputChange}
                value={formData.name}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Veuillez l'encient password"
              />
            </div>
            <div>
      
              <label className="block text-sm font-medium text-gray-700 mb-1">
                email *
              </label>
              <input
                type="text"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Veuillez l'encient password"
              />
            </div>
            <div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  role de l'utilisateur *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleHouseholdInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une langue</option>
                  <option value="chef_de_service">chef de service</option>
                  <option value="coordinateur">coordinateur</option>
                  <option value="nouveaux_utilisateur">nouveaux utilisateur</option>
                </select>
              </div>
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
            
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </motion.div>
      )}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-gray-400 mr-2" />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'chef_de_service' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'chef_de_service' ? 'Chef de service' : (user.role === 'coordinateur' ? 'Coordinateur' : 'nouveaux_utilisateur')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Actif
                    </span>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(user)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                        >
                          <Trash size={16} />
                        </motion.button>
                      </div>
                    </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-500">
              Aucun utilisateur ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
      />
    </div>
  );
};

export default Users;

