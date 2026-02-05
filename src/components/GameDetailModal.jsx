import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Save, Trash2, Calendar, Gamepad2, Clock, Star, Tag } from 'lucide-react';
import { updateGameStatus, updateGameProgress, updateGameNotes, deleteUserGame } from '../store/slices/userGamesSlice';

const STATUS_OPTIONS = [
  { value: 'wishlist', label: 'Wishlist', color: 'bg-pink-100 text-pink-700' },
  { value: 'backlog', label: 'Backlog', color: 'bg-slate-100 text-slate-700' },
  { value: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'playing', label: 'Playing', color: 'bg-blue-100 text-blue-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'dropped', label: 'Dropped', color: 'bg-red-100 text-red-700' },
];

function GameDetailModal({ isOpen, onClose, game }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    status: 'backlog',
    progress_percent: 0,
    playtime_hours: 0,
    notes: '',
    rating: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (game) {
      setFormData({
        status: game.status || 'backlog',
        progress_percent: game.progress_percent || 0,
        playtime_hours: game.playtime_hours || 0,
        notes: game.notes || '',
        rating: game.rating || 0,
        platform: game.selected_platform || '',
      });
    }
  }, [game]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'notes' || name === 'status' || name === 'platform' ? value : Number(value),
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Parallel updates for different fields if they changed
      const promises = [];

      if (formData.status !== game.status) {
        promises.push(dispatch(updateGameStatus({ id: game.id, status: formData.status })).unwrap());
      }

      if (formData.progress_percent !== game.progress_percent || formData.playtime_hours !== game.playtime_hours) {
        promises.push(
          dispatch(
            updateGameProgress({
              id: game.id,
              progressPercent: formData.progress_percent,
              playtimeHours: formData.playtime_hours,
            })
          ).unwrap()
        );
      }

      if (formData.notes !== game.notes || formData.rating !== game.rating || formData.platform !== game.selected_platform) {
        promises.push(
          dispatch(
            updateGameNotes({
              id: game.id,
              notes: formData.notes,
              rating: formData.rating,
              platform: formData.platform,
            })
          ).unwrap()
        );
      }

      await Promise.all(promises);
      onClose();
    } catch (error) {
      console.error('Failed to update game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to remove this game from your collection?')) {
      try {
        await dispatch(deleteUserGame(game.id)).unwrap();
        onClose();
      } catch (error) {
        console.error('Failed to delete game:', error);
      }
    }
  };

  if (!isOpen || !game) return null;

  const gameDetails = game.game || {};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-transparent dark:border-gray-700 transition-colors">
        {/* Header with Cover */}
        <div className="relative h-48 bg-gray-900">
          {gameDetails.cover_url && (
            <div className="absolute inset-0">
              <img
                src={gameDetails.cover_url.replace('t_cover_big', 't_screenshot_med')}
                alt="Background"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-6">
            <img
              src={gameDetails.cover_url || 'https://via.placeholder.com/150'}
              alt={gameDetails.title}
              className="w-24 h-36 object-cover rounded-lg shadow-lg border-2 border-white/20"
            />
            <div className="flex-1 mb-2">
              <h2 className="text-2xl font-bold text-white mb-1">{gameDetails.title}</h2>
              <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                {gameDetails.release_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(gameDetails.release_date).getFullYear()}
                  </span>
                )}
                {gameDetails.platforms && (
                  <span className="flex items-top gap-1">
                    <Gamepad2 className="w-4 h-4 mt-0.5" />
                    <span className="line-clamp-2">{gameDetails.platforms.join(', ')}</span>
                  </span>
                )}
                {gameDetails.genres && (
                  <span className="flex items-top gap-1">
                    <Tag className="w-4 h-4 mt-0.5" />
                    <span className="line-clamp-2">{gameDetails.genres.join(', ')}</span>
                  </span>
                )}
                {gameDetails.involved_companies && (
                   <span className="text-xs text-gray-400 block mt-1">
                     {gameDetails.involved_companies.join(', ')}
                   </span>
                )}
              </div>
              {gameDetails.summary && (
                  <p className="text-sm text-gray-300 mt-3 line-clamp-3 text-shadow-sm leading-relaxed">
                    {gameDetails.summary}
                  </p>
               )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Status & Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Progress ({formData.progress_percent}%)
              </label>
              <input
                type="range"
                name="progress_percent"
                min="0"
                max="100"
                value={formData.progress_percent}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select Platform</option>
                {gameDetails.platforms ? (
                   gameDetails.platforms.map(p => (
                     <option key={p} value={p}>{p}</option>
                   ))
                ) : (
                   <option value="PC">PC</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Playtime (Hours)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="number"
                  name="playtime_hours"
                  min="0"
                  step="0.5"
                  value={formData.playtime_hours}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`p-1 transition-transform hover:scale-110 ${
                      star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    <Star className={`w-8 h-8 ${star <= formData.rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="What do you think about this game?"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove Game
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-50 shadow-lg shadow-green-500/25 active:scale-95"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Confirm Update
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetailModal;
