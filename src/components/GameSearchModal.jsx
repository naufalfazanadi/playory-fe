import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Search, Loader2 } from 'lucide-react';
import api from '../services/api';
import { addGameToBacklog } from '../store/slices/userGamesSlice';

function GameSearchModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { games: userGames } = useSelector((state) => state.userGames);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addingGameId, setAddingGameId] = useState(null);

  const [offset, setOffset] = useState(0);

  // Memoize added provider IDs for quick lookup
  const addedProviderIds = new Set(userGames.map(ug => ug.game?.provider_id));

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      // Loading is already true from input change, but ensure it here too
      setLoading(true);
      setError('');
      
      try {
        const response = await api.get(`/api/v1/games/search?q=${encodeURIComponent(searchQuery)}&limit=9&offset=${offset}`);
        const newResults = response.data.data || [];
        
        setSearchResults(prev => {
            if (offset === 0) return newResults;
            // Prevent duplicates if API acts weird or race conditions
            const existingIds = new Set(prev.map(g => g.id));
            const distinctNew = newResults.filter(g => !existingIds.has(g.id));
            return [...prev, ...distinctNew];
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to search games');
        if (offset === 0) setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, offset]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setOffset(0); // Reset pagination on new search
    setSearchResults([]); // Clear immediate feedback
    if (query.trim()) {
      setLoading(true);
    }
  };

  const handleAddGame = async (game) => {
    setAddingGameId(game.id);
    setError('');

    try {
      // First, create the game in the database (or get existing)
      const createGameResponse = await api.post('/api/v1/games', {
        provider: game.provider,
        provider_id: game.provider_id,
        title: game.title,
        cover_url: game.cover_url,
        release_date: game.release_date,
        genres: game.genres || [],
        platforms: game.platforms || [],
        summary: game.summary,
        involved_companies: game.involved_companies || [],
      });

      const createdGame = createGameResponse.data.data;
      
      // Then add it to user's backlog
      await dispatch(addGameToBacklog(createdGame.id)).unwrap();
      
      // Close modal on success
      onClose();
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Error adding game:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.message || 'Failed to add game to backlog');
    } finally {
      setAddingGameId(null);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-transparent dark:border-gray-700 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search Games</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for games... (e.g., Elden Ring, Celeste)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg transition-colors"
              autoFocus
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && offset === 0 && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Searching games...</span>
            </div>
          )}

          {!loading && searchQuery && searchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No games found for "{searchQuery}"</p>
              <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
            </div>
          )}

          {!loading && !searchQuery && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Start typing to search for games</p>
              <p className="text-gray-400 text-sm mt-2">Powered by IGDB</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((game) => {
                const isAdded = addedProviderIds.has(game.provider_id);
                return (
                  <div
                    key={game.id}
                    className="flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:shadow-none hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group"
                  >
                    {/* Game Cover */}
                    <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-900 relative overflow-hidden flex-shrink-0">
                      {game.cover_url ? (
                        <img
                          src={game.cover_url}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                          <Search className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-xs">No Cover</span>
                        </div>
                      )}
                      
                      {isAdded && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                          <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transform -rotate-12 border border-white/20">
                            In Library
                          </span>
                        </div>
                      )}
                    </div>
  
                    {/* Game Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-4 flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">
                          {game.title}
                        </h3>
                        
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {game.release_date && (
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded mr-2">
                                    {new Date(game.release_date).getFullYear()}
                                </span>
                            )}
                            {game.genres && game.genres.length > 0 && (
                                <span className="truncate max-w-[120px]">
                                    {game.genres[0]}
                                </span>
                            )}
                        </div>
  
                        {game.platforms && game.platforms.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                              {game.platforms.slice(0, 3).map(p => (
                                  <span key={p} className="text-[10px] uppercase text-gray-400 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded">
                                      {p}
                                  </span>
                              ))}
                              {game.platforms.length > 3 && (
                                  <span className="text-[10px] text-gray-400 px-1 py-0.5">
                                      +{game.platforms.length - 3}
                                  </span>
                              )}
                          </div>
                        )}
                      </div>
  
                      <button
                        onClick={() => handleAddGame(game)}
                        disabled={addingGameId === game.id || isAdded}
                        className={`w-full py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center border
                          ${isAdded 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 cursor-default' 
                            : 'bg-violet-600 hover:bg-violet-500 text-white border-transparent shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-95'
                          } disabled:opacity-70 disabled:cursor-not-allowed`}
                      >
                        {addingGameId === game.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : isAdded ? (
                          'Already in Library'
                        ) : (
                          'Add to Backlog'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="mt-8 flex justify-center pb-4">
              <button
                onClick={() => setOffset(prev => prev + 9)}
                disabled={loading}
                className="btn-primary bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Loading...' : 'Load More Games'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameSearchModal;
