import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore'; 
import { logoutUser } from '../../services/authService';

export default function Navbar() {
  const { user, clearUser } = useAuthStore();
  const { theme, toggleTheme } = useUIStore(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      clearUser();
      navigate('/login');
    }
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-white shadow-md'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
              Task Manager Pro
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
            >
              {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
            </button>

            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
              {user?.displayName || user?.email}
            </span>
            
            <button onClick={handleLogout} className="btn-secondary">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}