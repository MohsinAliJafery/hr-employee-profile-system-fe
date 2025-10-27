import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  FolderOpen,
  FileText,
  Settings,
  Database,
  BarChart3,
  Home,
  Briefcase,
  GraduationCap,
  Globe,
  Building,
  MapPin,
  UserPlus,
  Calendar
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      name: 'Employee',
      icon: <Users size={20} />,
      submenu: [
        { name: 'Employee List', path: '/dashboard/employees', icon: <Users size={16} /> },
        { name: 'Documents', path: '/dashboard/documents', icon: <FolderOpen size={16} /> },
        { name: 'Previous Data', path: '/dashboard/prev', icon: <FileText size={16} /> },
        { name: 'Employee Residencies', path: '/dashboard/employee/residencystatus', icon: <UserPlus size={16} /> },
      ]
    },
    {
      name: 'Master Data',
      icon: <Database size={20} />,
      submenu: [
        { name: 'Visa Types', path: '/dashboard/visatypes', icon: <FileText size={16} /> },
        { name: 'Departments', path: '/dashboard/departments', icon: <Building size={16} /> },
        { name: 'Designations', path: '/dashboard/desginations', icon: <Briefcase size={16} /> },
        { name: 'Titles', path: '/dashboard/titles', icon: <GraduationCap size={16} /> },
        { name: 'Countries', path: '/dashboard/countries', icon: <Globe size={16} /> },
        { name: 'Cities', path: '/dashboard/cities', icon: <MapPin size={16} /> },
      ]
    },
    {
      name: 'Reports',
      icon: <BarChart3 size={20} />,
      submenu: [
        { name: 'Summary Report', path: '/dashboard/reports/summary', icon: <FileText size={16} /> },
        { name: 'Expiry Report', path: '/dashboard/reports/expiry', icon: <Calendar size={16} /> },
      ]
    },
    {
      name: 'Settings',
      path: '/dashboard/settings',
      icon: <Settings size={20} />
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* 🔹 Top Navbar (Mobile) */}
      <div className="md:hidden bg-[#450693] text-white flex justify-between items-center shadow-lg">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-[#8C00FF] transition-colors"
        >
          {isOpen ? <X size={24} className='text-white' /> : <Menu size={24} className='text-white' />}
        </button>
      </div>

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-[#450693] text-white flex flex-col transform transition-transform duration-300 z-40 shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.path ? (
                // Single menu item
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                    isActivePath(item.path) 
                      ? 'bg-white text-[#8C00FF] shadow-lg' 
                      : 'hover:bg-[#8C00FF] hover:bg-opacity-50 hover:shadow-md'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`${isActivePath(item.path) ? 'text-[#8C00FF]' : 'text-purple-200'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ) : (
                // Submenu item
                <div>
                  <button
                    className={`flex justify-between items-center w-full p-3 rounded-xl transition-all duration-200 group hover:bg-[#8C00FF] hover:bg-opacity-50 hover:shadow-md ${
                      openMenu === item.name.toLowerCase().replace(' ', '') ? 'bg-[#8C00FF] bg-opacity-30' : ''
                    }`}
                    onClick={() => toggleMenu(item.name.toLowerCase().replace(' ', ''))}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-purple-200">
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {openMenu === item.name.toLowerCase().replace(' ', '') ? 
                      <ChevronDown size={16} className="text-purple-200" /> : 
                      <ChevronRight size={16} className="text-purple-200" />
                    }
                  </button>
                  
                  {openMenu === item.name.toLowerCase().replace(' ', '') && (
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-[#8C00FF] border-opacity-30 pl-3">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 group ${
                            isActivePath(subItem.path)
                              ? 'bg-white text-[#8C00FF] shadow-md'
                              : 'hover:bg-[#8C00FF] hover:bg-opacity-30'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className={`${isActivePath(subItem.path) ? 'text-[#8C00FF]' : 'text-purple-200'}`}>
                            {subItem.icon}
                          </div>
                          <span className="text-sm font-medium">{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#8C00FF] border-opacity-30">
          <div className="text-center text-xs text-purple-200 opacity-70">
            v1.0.0 • EPR System
          </div>
        </div>
      </aside>

      {/* 🔹 Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};         

export default Sidebar;