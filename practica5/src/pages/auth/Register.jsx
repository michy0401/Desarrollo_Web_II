import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast'; 
import { registerUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    
    const result = await registerUser(data.email, data.password, data.displayName);

    if (result.success) {
      setUser(result.user);
      
      toast.success('¡Cuenta creada con éxito! Bienvenido a bordo.', {
        icon: '🚀',
        duration: 4000
      });
      
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600">Únete ahora</h1>
          <p className="text-gray-500 mt-2 font-medium">Empieza a organizar tus tareas hoy mismo</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              className={`input-field ${errors.displayName ? 'border-red-500 focus:ring-red-200' : ''}`}
              placeholder="Ej: Tu Nombre"
              {...register('displayName', { 
                required: 'El nombre es obligatorio',
                minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }
              })}
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.displayName.message}</p>
            )}
          </div>

          {}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
              placeholder="correo@ejemplo.com"
              {...register('email', { 
                required: 'El correo es obligatorio',
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                  message: 'Correo electrónico no válido' 
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          {}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className={`input-field ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
              placeholder="Mínimo 6 caracteres"
              {...register('password', { 
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          {}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg shadow-lg hover:shadow-xl transform transition-transform active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </span>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold underline transition-colors">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}