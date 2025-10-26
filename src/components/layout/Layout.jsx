import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../../utils/auth';
import { useEffect } from 'react';

const Layout = () => {
  
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        <Header handleLogout={handleLogout} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
