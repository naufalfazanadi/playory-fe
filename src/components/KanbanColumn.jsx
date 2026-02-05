import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableGameCard from './SortableGameCard';

const statusConfig = {
  backlog: { label: 'Backlog', color: 'bg-gray-400' },
  paused: { label: 'Paused', color: 'bg-yellow-400' },
  playing: { label: 'Playing', color: 'bg-blue-500' },
  completed: { label: 'Completed', color: 'bg-green-500' },
  dropped: { label: 'Dropped', color: 'bg-red-500' },
};

function KanbanColumn({ status, games, onGameClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const config = statusConfig[status] || { label: status, color: 'bg-gray-300' };

  return (
    <div className={`flex-1 min-w-[300px] flex flex-col rounded-2xl transition-all duration-200 border border-transparent ${
        isOver 
            ? 'bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20 border-primary/10' 
            : 'bg-gray-100 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800/50'
    }`}>
      <div className="p-4 flex-1 flex flex-col">
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${config.color} shadow-sm`}></div>
            <h2 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">{config.label}</h2>
          </div>
          <span className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 py-0.5 px-2.5 rounded-full text-xs font-semibold shadow-sm">
            {games.length}
          </span>
        </div>

        {/* Droppable Area */}
        <SortableContext
          id={status}
          items={games.map((g) => g.id)}
          strategy={verticalListSortingStrategy}
        >
          <div 
            ref={setNodeRef} 
            className={`flex-1 flex flex-col gap-3 min-h-[150px] transition-colors rounded-xl ${isOver ? 'bg-primary/5' : ''}`}
          >
            {games.length === 0 ? (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl m-1">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-600">Drop here</p>
              </div>
            ) : (
              games.map((game) => (
                <SortableGameCard 
                  key={game.id} 
                  game={game} 
                  onGameClick={onGameClick} 
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default KanbanColumn;
