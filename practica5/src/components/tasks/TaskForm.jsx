import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast'; 
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore'; 
import { createTask, updateTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';

export default function TaskForm({ onClose, taskToEdit = null }) {
    const user = useAuthStore((state) => state.user);
    const { theme } = useUIStore(); 
    const [loading, setLoading] = useState(false);
    
    const isEditing = !!taskToEdit;

    const defaultValues = taskToEdit ? {
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        category: taskToEdit.category,
        priority: taskToEdit.priority,
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.toISOString().split('T')[0] : ''
    } : {
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        dueDate: ''
    };

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        setLoading(true);
        
        const taskData = {
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : null
        };

        const result = isEditing 
            ? await updateTask(taskToEdit.id, taskData) 
            : await createTask(user.uid, taskData);

        if (result.success) {
            toast.success(isEditing ? '¡Tarea actualizada! 📝' : '¡Tarea creada con éxito! ✨');
            onClose();
        } else {
            toast.error('Ocurrió un error al procesar la tarea');
            console.error(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className={`card border-2 transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gray-800 border-blue-900 text-white' 
                : 'bg-white border-blue-100 text-gray-800'
        }`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                    {isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}
                </h3>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-red-500 transition-colors text-3xl"
                >
                    &times;
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {}
                <div>
                    <label className="block text-sm font-semibold mb-1">Título de la tarea *</label>
                    <input
                        type="text"
                        className={`input-field ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                        placeholder="Ej: Estudiar para Desarrollo Web II"
                        {...register('title', { 
                            required: 'El título es obligatorio', 
                            minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' } 
                        })}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {}
                <div>
                    <label className="block text-sm font-semibold mb-1">Descripción</label>
                    <textarea 
                        className={`input-field ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                        rows="3" 
                        placeholder="Añade detalles adicionales..."
                        {...register('description')} 
                    />
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Categoría</label>
                        <select 
                            className={`input-field ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                            {...register('category')}
                        >
                            {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Prioridad</label>
                        <select 
                            className={`input-field ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                            {...register('priority')}
                        >
                            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Vencimiento</label>
                        <input 
                            type="date" 
                            className={`input-field ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                            {...register('dueDate')} 
                        />
                    </div>
                </div>

                {}
                <div className="flex gap-3 justify-end pt-4">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="btn-primary flex items-center gap-2 px-8"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Guardando...
                            </>
                        ) : (
                            isEditing ? 'Actualizar Tarea' : 'Guardar Tarea'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}