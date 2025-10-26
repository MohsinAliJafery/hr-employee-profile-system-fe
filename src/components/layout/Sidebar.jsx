import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile sidebar toggle
  const [openMenu, setOpenMenu] = useState(null); // submenu toggle
  const location = useLocation();

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <>
      {/* 🔹 Top Navbar (Mobile) */}
      <div className="md:hidden bg-blue-800 text-white flex justify-between items-center p-4">
        <div className="text-lg font-bold">🧑‍💼 EPR Dashboard</div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-blue-800 text-white flex flex-col transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo / Header */}
        <div className="hidden md:block p-4 text-lg font-bold border-b border-blue-700">
          🧑‍💼 EPR Dashboard
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/dashboard/home"
            className={`block hover:bg-blue-700 p-2 rounded ${
              location.pathname === '/dashboard/home' ? 'bg-blue-700' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            🏠 Dashboard
          </Link>

          {/* Employees Menu */}
          <div>
            <button
              className="flex justify-between items-center w-full hover:bg-blue-700 p-2 rounded"
              onClick={() => toggleMenu('employees')}
            >
              <span>👤 Employee</span>
              {openMenu === 'employees' ? <ChevronDown /> : <ChevronRight />}
            </button>
            {openMenu === 'employees' && (
              <div className="ml-4 mt-1 space-y-2">
                {/* <Link
                  to="/dashboard/employee/add"
                  className="block hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  ➕ Add Employee
                </Link> */}
                <Link
                  to="/dashboard/employees"
                  className="block hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  📋 Employee
                </Link>
                <Link
                  to="/dashboard/documents"
                  className="block hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  🗂️ Documents
                </Link>
                 <Link
                  to="/dashboard/prev"
                  className="block hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  🗂️ Prev...
                </Link>
                <Link
                  to="/dashboard/employee/residencystatus"
                  className="block hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  🪪 Emp. Residencies
                </Link>
              </div>
            )}
          </div>

          {/* Master data */}
          <div>
            <button
              className="flex justify-between items-center w-full hover:bg-blue-700 p-2 rounded"
              onClick={() => toggleMenu('masterdata')}
            >
              <span>🗂️ Master Data</span>
              {openMenu === 'masterdata' ? <ChevronDown /> : <ChevronRight />}
            </button>
            {openMenu === 'masterdata' && (
              <div className="ml-4 mt-1 space-y-2">
                <Link
                  to="/dashboard/visatypes"
                  className="flex justify-between items-center w-full hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <span>🪪 Visa Types</span>
                </Link>
                <Link
                  to="/dashboard/departments"
                  className="flex justify-between items-center w-full hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <span>🏬 Departments</span>
                </Link>

                <Link
                  to="/dashboard/desginations"
                  className="flex justify-between items-center w-full hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <span>💼 Desginations</span>
                </Link>
                <Link
                  to="/dashboard/titles"
                  className="flex justify-between items-center w-full hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <span> 🎓 Titles</span>
                </Link>
                <Link
                  to="/dashboard/countries"
                  className="flex justify-between items-center w-full hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <span>🌍 Countries</span>
                </Link>
                <Link
                  to="/dashboard/cities"
                  className="flex justify-between items-center w-full hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <span> 🏙️ Cities</span>
                </Link>
              </div>
            )}
          </div>

          {/* Reports Menu */}
          <div>
            <button
              className="flex justify-between items-center w-full hover:bg-blue-700 p-2 rounded"
              onClick={() => toggleMenu('reports')}
            >
              <span>📊 Reports</span>
              {openMenu === 'reports' ? <ChevronDown /> : <ChevronRight />}
            </button>
            {openMenu === 'reports' && (
              <div className="ml-4 mt-1 space-y-2">
                <Link
                  to="/dashboard/reports/summary"
                  className="block hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  📄 Summary Report
                </Link>
                <Link
                  to="/dashboard/reports/expiry"
                  className="block hover:bg-blue-700 p-2 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  📆 Expiry Report
                </Link>
              </div>
            )}
          </div>

          {/* Settings */}
          <Link
            to="/dashboard/settings"
            className={`block hover:bg-blue-700 p-2 rounded ${
              location.pathname === '/dashboard/settings' ? 'bg-blue-700' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            ⚙️ Settings
          </Link>
        </nav>
      </aside>

      {/* 🔹 Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
