import { Search, Filter, X, LayoutGrid, List, ArrowUpDown } from 'lucide-react';

function FilterBar({ filters, setFilters, platforms, genres, viewMode, setViewMode }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = filters.search || filters.platform || filters.genre || (filters.sort && filters.sort !== 'updated_desc');
  const clearFilters = () => setFilters({ search: '', platform: '', genre: '', sort: 'updated_desc' });

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-30 transition-colors">
      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search your games..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        {/* View Toggle */}
        <div className="flex bg-gray-50 dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600 shrink-0">
            <button
            onClick={() => setViewMode('board')}
            className={`p-1.5 rounded-md transition-all ${
                viewMode === 'board' 
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title="Board View"
            >
            <LayoutGrid className="w-5 h-5" />
            </button>
            <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list' 
                ? 'bg-white dark:bg-gray-600 text-primary shadow-sm' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title="List View"
            >
            <List className="w-5 h-5" />
            </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                    value={filters.platform}
                    onChange={(e) => handleChange('platform', e.target.value)}
                    className="bg-transparent outline-none text-sm text-gray-600 dark:text-gray-300 w-32 cursor-pointer"
                >
                    <option value="" className="text-gray-900 dark:text-white dark:bg-gray-800">All Platforms</option>
                    {platforms.map(p => <option key={p} value={p} className="text-gray-900 dark:text-white dark:bg-gray-800">{p}</option>)}
                </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                    value={filters.genre}
                    onChange={(e) => handleChange('genre', e.target.value)}
                    className="bg-transparent outline-none text-sm text-gray-600 dark:text-gray-300 w-32 cursor-pointer"
                >
                    <option value="" className="text-gray-900 dark:text-white dark:bg-gray-800">All Genres</option>
                    {genres.map(g => <option key={g} value={g} className="text-gray-900 dark:text-white dark:bg-gray-800">{g}</option>)}
                </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                    value={filters.sort || 'updated_desc'}
                    onChange={(e) => handleChange('sort', e.target.value)}
                    className="bg-transparent outline-none text-sm text-gray-600 dark:text-gray-300 w-32 cursor-pointer"
                >
                    <option value="updated_desc" className="text-gray-900 dark:text-white dark:bg-gray-800">Recently Updated</option>
                    <option value="updated_asc" className="text-gray-900 dark:text-white dark:bg-gray-800">Oldest Updated</option>
                    <option value="title_asc" className="text-gray-900 dark:text-white dark:bg-gray-800">Title (A-Z)</option>
                    <option value="title_desc" className="text-gray-900 dark:text-white dark:bg-gray-800">Title (Z-A)</option>
                    <option value="rating_desc" className="text-gray-900 dark:text-white dark:bg-gray-800">Highest Rated</option>
                    <option value="rating_asc" className="text-gray-900 dark:text-white dark:bg-gray-800">Lowest Rated</option>
                </select>
            </div>

            {hasActiveFilters && (
                <button 
                    onClick={clearFilters}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors shrink-0"
                    title="Clear Filters"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
