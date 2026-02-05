import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { fetchUserGames, updateGameStatus, moveGame } from '../store/slices/userGamesSlice';
import { logout } from '../store/slices/authSlice';
import KanbanColumn from '../components/KanbanColumn';
import GameCard from '../components/GameCard';
import GameSearchModal from '../components/GameSearchModal';
import GameDetailModal from '../components/GameDetailModal';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import GameListView from '../components/GameListView';

const STATUSES = ['wishlist', 'backlog', 'paused', 'playing', 'completed', 'dropped'];

function Board() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { games, loading } = useSelector((state) => state.userGames);
  const [activeId, setActiveId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [viewMode, setViewMode] = useState('board');
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    platform: '',
    genre: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    dispatch(fetchUserGames());
  }, [dispatch]);

  // Extract available platforms and genres
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

  // Filter games logic
  const filteredGames = useMemo(() => {
    const list = Array.isArray(games) ? games : [];
    return list.filter((item) => {
      const g = item.game;
      if (!g) return false;

      // Search (title)
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
  }, [games, filters]);

  const gamesByStatus = useMemo(() => {
    const grouped = {};
    STATUSES.forEach((status) => {
      grouped[status] = filteredGames.filter((game) => game.status === status);
    });
    return grouped;
  }, [filteredGames]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const gameId = active.id;
    let newStatus = over.id;

    // If dropped on a card, find the status of that card
    if (!STATUSES.includes(newStatus)) {
      const overGame = games.find(g => g.id === over.id);
      if (overGame) {
        newStatus = overGame.status;
      }
    }

    const game = games.find((g) => g.id === gameId);
    
    if (game && game.status !== newStatus && STATUSES.includes(newStatus)) {
      // Optimistic update
      dispatch(moveGame({ id: gameId, newStatus }));
      // API update
      dispatch(updateGameStatus({ id: gameId, status: newStatus }));
    }

    setActiveId(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const activeGame = activeId ? games.find((g) => g.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onSearchClick={() => setIsAddModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
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
              <div className="text-gray-600 dark:text-gray-400">Loading your games...</div>
            </div>
          ) : (
            <div className="h-full">
                {/* Check if filtered result is empty but initial list wasn't */}
                {filteredGames.length === 0 && games?.length > 0 ? (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        No games match your filters.
                    </div>
                ) : (
                    <>
                        {viewMode === 'board' ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCorners}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="flex gap-6 overflow-x-auto pb-8 items-stretch min-h-[calc(100vh-250px)] px-2 custom-scrollbar">
                                {STATUSES.map((status) => (
                                    <KanbanColumn
                                    key={status}
                                    status={status}
                                    games={gamesByStatus[status] || []}
                                    onGameClick={setSelectedGame}
                                    />
                                ))}
                                </div>

                                <DragOverlay>
                                {activeGame ? <GameCard game={activeGame} /> : null}
                                </DragOverlay>
                            </DndContext>
                        ) : (
                            <GameListView 
                                games={filteredGames} 
                                onGameClick={setSelectedGame} 
                            />
                        )}
                    </>
                )}
            </div>
          )}
        </div>
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

export default Board;
