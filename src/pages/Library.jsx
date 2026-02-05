import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserGames } from '../store/slices/userGamesSlice';
import { logout } from '../store/slices/authSlice';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import GameCard from '../components/GameCard';
import GameListView from '../components/GameListView';
import GameDetailModal from '../components/GameDetailModal';
import GameSearchModal from '../components/GameSearchModal';

function Library() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { games, loading } = useSelector((state) => state.userGames);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('board'); // defaulting to grid view

  const [filters, setFilters] = useState({
    search: '',
    platform: '',
    genre: '',
    sort: 'updated_desc'
  });

  useEffect(() => {
    dispatch(fetchUserGames());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Derive platforms/genres from games
  const { platforms, genres } = useMemo(() => {
    const pSet = new Set();
    const gSet = new Set();
    const list = Array.isArray(games) ? games : [];
    
    list.forEach((item) => {
      item.game?.platforms?.forEach((p) => pSet.add(p));
      item.game?.genres?.forEach((g) => gSet.add(g));
    });

    return {
      platforms: Array.from(pSet).sort(),
      genres: Array.from(gSet).sort(),
    };
  }, [games]);

  // Filter & Sort Logic
  const filteredAndSortedGames = useMemo(() => {
    let result = Array.isArray(games) ? [...games] : [];

    // Filter
    result = result.filter((item) => {
      const g = item.game;
      if (!g) return false;

      // Search
      if (filters.search) {
        if (!g.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      }
      // Platform
      if (filters.platform) {
        if (!g.platforms?.includes(filters.platform)) return false;
      }
      // Genre
      if (filters.genre) {
        if (!g.genres?.includes(filters.genre)) return false;
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
        const gA = a.game;
        const gB = b.game;
        if (!gA || !gB) return 0;

        switch (filters.sort) {
            case 'title_asc':
                return gA.title.localeCompare(gB.title);
            case 'title_desc':
                return gB.title.localeCompare(gA.title);
            case 'updated_asc':
                return new Date(a.updated_at) - new Date(b.updated_at);
            case 'updated_desc':
                return new Date(b.updated_at) - new Date(a.updated_at);
             case 'rating_desc':
                return (b.rating || 0) - (a.rating || 0);
            case 'rating_asc':
                return (a.rating || 0) - (b.rating || 0);
            default:
                return 0;
        }
    });

    return result;
  }, [games, filters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onSearchClick={() => setIsAddModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Library</h2>

        <FilterBar 
            filters={filters}
            setFilters={setFilters}
            platforms={platforms}
            genres={genres}
            viewMode={viewMode}
            setViewMode={setViewMode}
        />

        {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-600 dark:text-gray-400">Loading library...</div>
            </div>
        ) : (
             <>
                {filteredAndSortedGames.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        {games?.length === 0 
                            ? "Your library is empty. Start adding some games!" 
                            : "No games match your filters."}
                    </div>
                ) : (
                    <>
                        {viewMode === 'board' ? ( // Reusing 'board' identifier for Grid view
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                                {filteredAndSortedGames.map(game => (
                                    <GameCard 
                                        key={game.id} 
                                        game={game} 
                                        onClick={() => setSelectedGame(game)}
                                        // Ensuring card looks static/clickable not draggable
                                    />
                                ))}
                             </div>
                        ) : (
                            <GameListView 
                                games={filteredAndSortedGames} 
                                onGameClick={setSelectedGame} 
                            />
                        )}
                    </>
                )}
             </>
        )}
      </main>

      <GameSearchModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <GameDetailModal
        isOpen={!!selectedGame}
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </div>
  );
}

export default Library;
