import { useState } from 'react';
import { useUIStore } from '../../store/uiStore'; 
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskList({ tasks }) {
    const [showForm, setShowForm] = useState(false);
    const { theme } = useUIStore(); 

    return (
        <div className="transition-colors duration-300">
            {}
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                    Mis Tareas ({tasks.length})
                </h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary shadow-lg hover:shadow-blue-500/20"
                >
                    + Nueva Tarea
                </button>
            </div>

            {}
            {showForm && (
                <div className="mb-6">
                    <TaskForm onClose={() => setShowForm(false)} />
                </div>
            )}

            {}
            {tasks.length === 0 ? (
                <div className={`card text-center py-12 transition-all ${
                    theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 border-dashed border-2' 
                        : 'bg-white border-dashed border-2 border-gray-200'
                }`}>
                    <div className="text-5xl mb-4">📝</div>
                    <p className={`text-lg font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                        No hay tareas para mostrar
                    </p>
                    <p className={`mt-2 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                        Haz clic en "Nueva Tarea" para comenzar a organizar tu día.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
}