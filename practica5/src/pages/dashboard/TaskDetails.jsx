import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import { useUIStore } from '../../store/uiStore'; 
import { getTaskById, updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { formatDateTime, getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TaskForm from '../../components/tasks/TaskForm';

export default function TaskDetails() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { theme } = useUIStore();
    
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        loadTask();
    }, [taskId]);

    const loadTask = async () => {
        setLoading(true);
        const result = await getTaskById(taskId);
        if (result.success) {
            setTask(result.task);
        } else {
            toast.error('No se pudo encontrar la tarea');
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleToggleComplete = async () => {
        const newStatus = !task.completed;
        const result = await updateTask(taskId, { completed: newStatus });
        
        if (result.success) {
            setTask({ ...task, completed: newStatus });
            toast.success(newStatus ? '¡Tarea completada! 🥳' : 'Tarea pendiente');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás segura de eliminar permanentemente esta tarea?')) {
            const result = await deleteTask(taskId);
            if (result.success) {
                toast.error('Tarea eliminada con éxito', { icon: '🗑️' });
                navigate('/dashboard');
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    if (editing) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <TaskForm 
                    taskToEdit={task} 
                    onClose={() => { 
                        setEditing(false); 
                        loadTask(); 
                    }} 
                />
            </div>
        );
    }

    const category = CATEGORIES.find(c => c.id === task.category);
    const priority = PRIORITIES.find(p => p.id === task.priority);

    return (
        <div className="max-w-4xl mx-auto p-6 transition-colors duration-300">
            {}
            <div className="mb-6">
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2 transition-colors">
                    ← Volver al Dashboard
                </Link>
            </div>

            {}
            <div className={`card shadow-xl border-t-8 transition-colors duration-300 ${
                task.completed ? 'border-gray-400' : 'border-blue-600'
            } ${theme === 'dark' ? 'bg-gray-800 text-white border-blue-900' : 'bg-white text-gray-800'}`}>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                    <div className="flex-1">
                        <h1 className={`text-4xl font-black mb-4 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                        </h1>
                        
                        <div className="flex flex-wrap gap-3">
                            <span className={`px-4 py-1 rounded-full text-sm font-bold bg-${category?.color}-100 text-${category?.color}-800`}>
                                {category?.label}
                            </span>
                            <span className={`px-4 py-1 rounded-full text-sm font-bold bg-${priority?.color}-100 text-${priority?.color}-800`}>
                                Prioridad: {priority?.label}
                            </span>
                            {task.completed && (
                                <span className="px-4 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                                    Finalizada
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => setEditing(true)} className="btn-secondary flex-1 md:flex-none">
                            Editar
                        </button>
                        <button onClick={handleDelete} className="btn-danger flex-1 md:flex-none bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                            Eliminar
                        </button>
                    </div>
                </div>

                <div className={`border-t pt-8 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h2 className="text-xl font-bold mb-4 opacity-70 uppercase tracking-widest text-sm">Descripción</h2>
                    <p className={`text-lg leading-relaxed whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {task.description || 'Esta tarea no tiene una descripción detallada.'}
                    </p>
                </div>

                <div className={`border-t pt-8 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                        <dt className="text-xs font-bold text-gray-500 uppercase mb-1">Fecha de creación</dt>
                        <dd className="text-lg font-medium">{formatDateTime(task.createdAt)}</dd>
                    </div>
                    {task.dueDate && (
                        <div>
                            <dt className="text-xs font-bold text-gray-500 uppercase mb-1">Vencimiento</dt>
                            <dd className={`text-lg font-bold ${isOverdue(task.dueDate, task.completed) ? 'text-red-500 animate-pulse' : ''}`}>
                                {formatDateTime(task.dueDate)} 
                                <span className="ml-2 text-sm font-normal">({getDueDateLabel(task.dueDate)})</span>
                            </dd>
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    <button 
                        onClick={handleToggleComplete}
                        className={`w-full py-4 rounded-xl text-xl font-black transition-all transform active:scale-95 shadow-lg ${
                            task.completed 
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200'
                        }`}
                    >
                        {task.completed ? 'Marcar como pendiente' : '¡Completar Tarea! 🎉'}
                    </button>
                </div>
            </div>
        </div>
    );
}