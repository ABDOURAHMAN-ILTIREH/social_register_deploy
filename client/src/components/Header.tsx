import { motion } from 'framer-motion';
import { Search, LogOut, Menu } from 'lucide-react';
import { useUi } from '../contexts/UiContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { toggleSidebar, searchQuery, handleSearch } = useUi();
  const { user, logout } = useAuth();


  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-4 relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64 px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">   
          <div className="flex items-center">
            <div className="mr-3 text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 focus:outline-none"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;