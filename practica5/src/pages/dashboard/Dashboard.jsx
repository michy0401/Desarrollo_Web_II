import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore'; 
import { useTasks } from '../../hooks/useTasks';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskList from '../../components/tasks/TaskList';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const { theme } = useUIStore(); 
    const { tasks, currentFilter, currentCategory, searchQuery, loading } = useTaskStore();

    useTasks();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;
        if (currentFilter === 'completed' && !task.completed) return false;
        if (currentFilter === 'pending' && task.completed) return false;
        if (currentCategory !== 'all' && task.category !== currentCategory) return false;
        
        return true;
    });

    if (loading && tasks.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 transition-colors duration-300">
            {}
            <div className="mb-8">
                <h1 className={`text-4xl font-black ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    Bienvenida, {user?.displayName || 'Michelle'}
                </h1>
                <p className={`mt-2 font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    {pendingTasks === 0 
                        ? '🎉 ¡Felicidades! No tienes tareas pendientes.' 
                        : `Tienes ${pendingTasks} tareas esperando tu atención.`}
                </p>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {}
                <div className={`card border-t-4 border-blue-500 shadow-lg transition-all ${
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">Total Tareas</p>
                    <p className="text-5xl font-black">{totalTasks}</p>
                </div>

                {}
                <div className={`card border-t-4 border-green-500 shadow-lg transition-all ${
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}>
                    <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-1">Completadas</p>
                    <p className="text-5xl font-black text-green-600">{completedTasks}</p>
                </div>

                {}
                <div className={`card border-t-4 border-yellow-500 shadow-lg transition-all ${
                    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}>
                    <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-1">Pendientes</p>
                    <p className="text-5xl font-black text-yellow-600">{pendingTasks}</p>
                </div>
            </div>

            {}
            <TaskFilters />
            <TaskList tasks={filteredTasks} />
        </div>
    );
}