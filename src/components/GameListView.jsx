import { useMemo } from 'react';
import { Clock, TrendingUp, Calendar, Hash } from 'lucide-react';

const statusColors = {
  backlog: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  playing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  dropped: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

function GameListView({ games, onGameClick }) {
  const sortedGames = useMemo(() => {
    return [...games].sort((a, b) => {
        // Default sort by updated_at desc
        return new Date(b.updated_at) - new Date(a.updated_at);
    });
  }, [games]);

  if (games.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        No games found matching your filters.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">
              <th className="px-6 py-4">Game</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Platform</th>
              <th className="px-6 py-4">Genre</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4 hidden md:table-cell">Playtime</th>
              <th className="px-6 py-4 hidden lg:table-cell">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {sortedGames.map((game) => (
              <tr 
                key={game.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                onClick={() => onGameClick(game)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={game.game?.cover_url || 'https://via.placeholder.com/40'} 
                      alt="" 
                      className="w-10 h-14 object-cover rounded bg-gray-200 dark:bg-gray-700" 
                    />
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {game.game?.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[game.status]}`}>
                    {game.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {game.game?.platforms?.[0] || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {game.game?.genres?.[0] || '-'}
                </td>
                <td className="px-6 py-4">
                    {game.progress_percent > 0 ? (
                        <div className="flex items-center gap-2">
                             <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 ">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${game.progress_percent}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{game.progress_percent}%</span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">-</span>
                    )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                   {game.playtime_hours > 0 ? `${game.playtime_hours}h` : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                  {new Date(game.updated_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GameListView;
