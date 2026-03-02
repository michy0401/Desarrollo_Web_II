import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore'; 
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';

export default function TaskCard({ task }) {
    const { theme } = useUIStore(); 
    const category = CATEGORIES.find(c => c.id === task.category);

    const handleToggleComplete = async (e) => {
        e.preventDefault(); 
        const result = await updateTask(task.id, { completed: !task.completed });
        if(result.success) {
            toast.success(task.completed ? 'Tarea pendiente' : '¡Tarea completada! 🎉');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (window.confirm('¿Deseas eliminar esta tarea?')) {
            const result = await deleteTask(task.id);
            if(result.success) toast.error('Tarea eliminada', { icon: '🗑️' });
        }
    };

    return (
        <Link to={`/tasks/${task.id}`} className="block transform transition-transform hover:scale-[1.01] active:scale-95">
            {}
            <div className={`card border-l-8 transition-all duration-300 ${
                task.completed ? 'opacity-60 border-gray-400' : 
                isOverdue(task.dueDate, task.completed) ? 'border-red-500' : 'border-blue-600'
            } ${
                theme === 'dark' 
                    ? 'bg-gray-800 text-white shadow-none border-opacity-80' 
                    : 'bg-white text-gray-800 shadow-md'
            }`}>
                
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            {}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-blue-300' 
                                    : `bg-${category?.color || 'blue'}-100 text-${category?.color || 'blue'}-800`
                            }`}>
                                {category?.label}
                            </span>
                            
                            {task.dueDate && (
                                <span className={`text-xs font-medium ${
                                    isOverdue(task.dueDate, task.completed) 
                                        ? 'text-red-500' 
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                    📅 {getDueDateLabel(task.dueDate)}
                                </span>
                            )}
                        </div>

                        {}
                        <h3 className={`text-xl font-bold truncate ${
                            task.completed ? 'line-through opacity-50' : ''
                        }`}>
                            {task.title}
                        </h3>
                        
                        {task.description && (
                            <p className={`text-sm mt-1 line-clamp-1 italic ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {task.description}
                            </p>
                        )}
                    </div>

                    {}
                    <div className="flex gap-2 ml-4">
                        <button
                            onClick={handleToggleComplete}
                            className={`p-2 rounded-full transition-colors ${
                                task.completed 
                                    ? 'bg-green-100 text-green-600' 
                                    : theme === 'dark' 
                                        ? 'bg-gray-700 text-gray-400 hover:text-green-400' 
                                        : 'bg-gray-100 text-gray-400 hover:text-green-600'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                        
                        <button
                            onClick={handleDelete}
                            className={`p-2 rounded-full transition-colors ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-gray-400 hover:bg-red-900/30 hover:text-red-400' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}