import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import api from '../services/api';
import { addGameToBacklog } from '../store/slices/userGamesSlice';

function AddGameModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    coverUrl: '',
    platforms: '',
    genres: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, create the game
      const gameResponse = await api.post('/api/v1/games', {
        title: formData.title,
        cover_url: formData.coverUrl,
        platforms: formData.platforms ? formData.platforms.split(',').map(p => p.trim()) : [],
        genres: formData.genres ? formData.genres.split(',').map(g => g.trim()) : [],
      });

      const game = gameResponse.data.data;

      // Then add it to user's backlog
      await dispatch(addGameToBacklog(game.id));

      // Reset and close
      setFormData({ title: '', coverUrl: '', platforms: '', genres: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add game');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Game Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="The Legend of Zelda: Breath of the Wild"
            />
          </div>

          <div>
            <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverUrl"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div>
            <label htmlFor="platforms" className="block text-sm font-medium text-gray-700 mb-1">
              Platforms
            </label>
            <input
              type="text"
              id="platforms"
              name="platforms"
              value={formData.platforms}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Nintendo Switch, PC (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple platforms with commas</p>
          </div>

          <div>
            <label htmlFor="genres" className="block text-sm font-medium text-gray-700 mb-1">
              Genres
            </label>
            <input
              type="text"
              id="genres"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Action, Adventure, RPG (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple genres with commas</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGameModal;
