import { Outlet } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import Navbar from './Navbar';

export default function Layout() {
  const { theme } = useUIStore();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {}
      <Navbar />
      
      <main>
        {}
        {}
        <Outlet />
      </main>
    </div>
  );
}