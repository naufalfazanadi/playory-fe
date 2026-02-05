import { useMemo } from 'react';
import { Gamepad2, Clock, TrendingUp } from 'lucide-react';

const statusConfig = {
  backlog: { label: 'Backlog', color: 'bg-gray-400', icon: Gamepad2 },
  paused: { label: 'Paused', color: 'bg-yellow-400', icon: Clock },
  playing: { label: 'Playing', color: 'bg-blue-500', icon: TrendingUp },
  completed: { label: 'Completed', color: 'bg-green-500', icon: TrendingUp },
  dropped: { label: 'Dropped', color: 'bg-red-500', icon: TrendingUp },
};

function GameCard({ game, onStatusChange, onClick }) {
  const config = statusConfig[game.status] || statusConfig.backlog;
  const Icon = config.icon;

  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 mb-3 cursor-move shadow-sm hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 hover:-translate-y-0.5 rounded-xl group"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Game Cover */}
        <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner relative group-hover:ring-2 ring-primary/10 transition-all">
          {game.game?.cover_url ? (
            <img
              src={game.game.cover_url}
              alt={game.game.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <Gamepad2 className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          )}
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0 py-0.5">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-[15px] leading-tight group-hover:text-primary transition-colors">
            {game.game?.title || 'Untitled Game'}
          </h3>
          
          <div className="flex flex-wrap gap-2 mt-1.5">
            {game.selected_platform ? (
                <span className="text-[10px] uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-1.5 py-0.5 rounded text-center">
                {game.selected_platform}
                </span>
            ) : null}
             {game.game?.genres && game.game.genres.length > 0 && (
                <span className="text-[10px] uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-1.5 py-0.5 rounded text-center truncate max-w-[80px]">
                {game.game.genres[0]}
                </span>
            )}
          </div>

          {/* Progress Bar */}
          {game.progress_percent > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span className={game.progress_percent === 100 ? 'text-green-500' : ''}>{game.progress_percent}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${config.color}`}
                  style={{ width: `${game.progress_percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats Footer */}
          {!game.progress_percent && game.playtime_hours > 0 && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{game.playtime_hours}h</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameCard;
