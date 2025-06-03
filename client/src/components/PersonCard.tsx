import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Calendar, Briefcase } from 'lucide-react';
import type { Personne } from '../types/database';

interface PersonCardProps {
  person: Personne;
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className={`h-2 ${person.sexe === 'M' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {person.nom_prenoms}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <User size={16} className="mr-2 text-gray-400" />
            <span>{person.sexe === 'M' ? 'Homme' : 'Femme'}</span>
            {person.enceinte && (
              <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-800 rounded-full text-xs">Enceinte</span>
            )}
          </div>
          
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span>Né(e) le: {new Date(person.date_naissance).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center">
            <Briefcase size={16} className="mr-2 text-gray-400" />
            <span>{person.statut_occupation}</span>
          </div>
          
          <div className="flex items-center mt-1">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {person.lien_parental}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <Link 
            to={`/persons/${person.id}`} 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Voir détails →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonCard;