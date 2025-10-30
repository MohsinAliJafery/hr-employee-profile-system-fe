import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../../utils/auth';
import { useEffect, useState } from 'react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header 
        handleLogout={handleLogout} 
        onMenuToggle={toggleSidebar}
        // userName={getCurrentUser()?.name || "Admin User"}
        // userRole={getCurrentUser()?.role || "Administrator"}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;