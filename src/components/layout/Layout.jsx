import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../../utils/auth';
import { useEffect } from 'react';

const Layout = () => {
  
  const navigate = useNavigate();
  // const user = getCurrentUser();

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
    <div className="flex flex-col h-screen">
      <Header handleLogout={handleLogout} />
      <div className="flex flex-1 min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto m-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
