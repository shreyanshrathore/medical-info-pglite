import { Menu, FilePlus, Database, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <header className="fixed w-full top-0 left-0 bg-white h-16 shadow-sm z-30">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
          >
            <Menu size={24} />
          </button>
          
          {/* Logo and title */}
          <div className="ml-2 md:ml-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="text-teal-600">
                <FilePlus size={24} />
              </div>
              <span className="text-xl font-semibold text-gray-900">MediRecord</span>
            </Link>
          </div>
        </div>
        
        {/* Navigation icons for desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/register" className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors">
            <UserCircle size={20} />
          </Link>
          <Link to="/query" className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors">
            <Database size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;