import { MouseEvent, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, UserPlus, Database, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, isMobile, closeSidebar }: SidebarProps) => {
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMobile && isOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("click", handleOutsideClick as any);
    return () =>
      document.removeEventListener("click", handleOutsideClick as any);
  }, [isMobile, isOpen, closeSidebar]);

  const sidebarClass = isMobile
    ? `fixed left-0 top-0 z-40 h-screen pt-16 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`
    : "fixed left-0 top-0 z-20 h-screen pt-16 w-64 bg-white shadow-lg transition-all";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-gray-700 ${
      isActive
        ? "bg-teal-50 text-teal-600 border-l-4 border-teal-600"
        : "border-l-4 border-transparent hover:bg-gray-50"
    } transition-all`;

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={sidebarClass} onClick={stopPropagation}>
      {/* Mobile close button */}
      {isMobile && isOpen && (
        <button
          onClick={closeSidebar}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X size={20} />
        </button>
      )}

      <nav className="h-full pt-4 pb-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={linkClass}
              onClick={closeSidebar}
            >
              <Home size={20} className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className={linkClass}
              onClick={closeSidebar}
            >
              <UserPlus size={20} className="mr-3" />
              Register Patient
            </NavLink>
          </li>
          <li>
            <NavLink to="/query" className={linkClass} onClick={closeSidebar}>
              <Database size={20} className="mr-3" />
              SQL Query
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
