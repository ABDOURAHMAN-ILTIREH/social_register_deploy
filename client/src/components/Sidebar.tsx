import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  UserCheck,
  Calendar,
  User,
  UserCircle
} from 'lucide-react';
import { useUi } from '../contexts/UiContext';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { sidebarOpen, setActiveTab } = useUi();
  const { isAdmin } = useAuth();
  
  const sidebarVariants = {
    open: { width: '16rem' },
    closed: { width: '5rem' }
  };
  
  const linkVariants = {
    open: { opacity: 1, display: 'block' },
    closed: { opacity: 0, display: 'none' }
  };
  
  const logoVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  // Define navigation items based on user role
  const navigationItems = [
    { name: 'Tableau de bord', path: '/dashboard', icon: <Home size={20} />, adminOnly: false },
    { name: 'Ménages', path: '/households', icon: <Users size={20} />, adminOnly: false },
    { name: 'Personnes', path: '/persons', icon: <UserCircle size={20} />, adminOnly: false },
    { name: 'Enquêteurs', path: '/surveyors', icon: <UserCheck size={20} />, adminOnly: true },
    { name: 'Entretiens', path: '/interviews', icon: <Calendar size={20} />, adminOnly: true },
    { name: 'Utilisateurs', path: '/users', icon: <User size={20} />, adminOnly: true },

  ];
  
  return (
    <motion.div
      initial={sidebarOpen ? 'open' : 'closed'}
      animate={sidebarOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-blue-900 text-white z-20 overflow-hidden"
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-blue-800">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-white">
            <Users size={28} />
          </div>
          <motion.div 
            variants={logoVariants} 
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            <span className="text-xl font-semibold">Portail</span>
          </motion.div>
        </div>
      </div>
      
      <div className="py-6">
        <ul className="space-y-2">
          {navigationItems
            .filter(item => !item.adminOnly || isAdmin)
            .map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setActiveTab(item.path.replace('/', ''))}
                  className={({ isActive }) => 
                    `flex items-center py-3 px-4 ${isActive ? 'bg-blue-800' : 'hover:bg-blue-800/70'} transition-all duration-200`
                  }
                >
                  <div className="flex items-center">
                    <span>{item.icon}</span>
                    <motion.span
                      variants={linkVariants}
                      transition={{ duration: 0.2 }}
                      className="ml-3 text-sm font-medium"
                    >
                      {item.name}
                    </motion.span>
                  </div>
                </NavLink>
              </li>
            ))}
        </ul>
        
      </div>
    </motion.div>
  );
};

export default Sidebar;