import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ResetPasswordForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate(); 
  const { resetPassword, loading, error, resetError } = useAuth();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({
    passwordMatch: '',
    passwordLength: ''
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Clear errors when form data changes
  useEffect(() => {
    if (formData.newPassword && formData.confirmPassword) {
      setFormErrors({
        passwordMatch: formData.newPassword !== formData.confirmPassword 
          ? 'Les mots de passe ne correspondent pas' 
          : '',
        passwordLength: formData.newPassword.length < 6 
          ? 'Le mot de passe doit contenir au moins 6 caractères' 
          : ''
      });
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (error || submitError) {
      resetError();
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (formData.newPassword !== formData.confirmPassword) {
      setSubmitError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setSubmitError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!token) {
      setSubmitError('Lien de réinitialisation invalide');
      return;
    }

    try {
      await resetPassword(token, formData.newPassword);
      navigate('/login', { 
        state: { 
          message: 'Votre mot de passe a été réinitialisé avec succès' 
        } 
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const displayError = submitError || error;
  const isFormValid = formData.newPassword === formData.confirmPassword && 
                     formData.newPassword.length >= 6;

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <User size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Réinitialiser votre mot de passe</h2>
          <p className="text-gray-600 mt-1">Entrez votre nouveau mot de passe</p>
        </div>

        {displayError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-6"
          >
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{displayError}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
                required
                minLength={6}
              />
            </div>
            {formErrors.passwordLength && (
              <p className="mt-1 text-sm text-red-600">{formErrors.passwordLength}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
                required
                minLength={6}
              />
            </div>
            {formErrors.passwordMatch && (
              <p className="mt-1 text-sm text-red-600">{formErrors.passwordMatch}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading || !isFormValid ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordForm;