import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore'; 
import { FILTERS, CATEGORIES } from '../../utils/constants';

export default function TaskFilters() {
    const { 
        currentFilter, 
        currentCategory, 
        searchQuery, 
        setFilter, 
        setCategory, 
        setSearchQuery 
    } = useTaskStore();

    const { theme } = useUIStore();

    return (
        <div className={`card mb-6 transition-all duration-300 ${
            theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white shadow-none' 
                : 'bg-white border-blue-50 text-gray-800 shadow-md'
        }`}>
            
            {}
            <div className="mb-6">
                <label className="block text-sm font-bold mb-2 opacity-80 uppercase tracking-wide">
                    Buscar por título o descripción
                </label>
                <input
                    type="text"
                    className={`input-field transition-colors ${
                        theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'bg-white border-gray-200 text-gray-900 focus:border-blue-400'
                    }`}
                    placeholder="Ej: Estudiar para el parcial..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {}
                <div>
                    <label className="block text-sm font-bold mb-3 opacity-80 uppercase tracking-wide">
                        Filtrar por estado
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setFilter(filter.id)}
                                className={`px-5 py-2 rounded-xl font-bold transition-all transform active:scale-95 ${
                                    currentFilter === filter.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : theme === 'dark'
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {}
                <div>
                    <label className="block text-sm font-bold mb-3 opacity-80 uppercase tracking-wide">
                        Filtrar por categoría
                    </label>
                    <select
                        value={currentCategory}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`input-field font-medium transition-colors ${
                            theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    >
                        <option value="all">Todas las categorías</option>
                        {CATEGORIES.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}