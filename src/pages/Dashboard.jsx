import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserGames } from '../store/slices/userGamesSlice';
import { logout } from '../store/slices/authSlice';
import Navbar from '../components/Navbar';
import GameDetailModal from '../components/GameDetailModal';
import GameSearchModal from '../components/GameSearchModal';
import { Trophy, Gamepad2, Clock, List, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { games, loading } = useSelector((state) => state.userGames);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserGames());
  }, [dispatch]);

  const { stats, chartData, platformData, recentGames } = useMemo(() => {
    const list = Array.isArray(games) ? games : [];
    const total = list.length;
    const completed = list.filter((g) => g.status === 'completed').length;
    const playing = list.filter((g) => g.status === 'playing').length;
    const backlog = list.filter((g) => g.status === 'backlog').length;
    const wishlist = list.filter((g) => g.status === 'wishlist').length;
    const paused = list.filter((g) => g.status === 'paused').length;
    const dropped = list.filter((g) => g.status === 'dropped').length;
    
    const totalHours = list.reduce((acc, g) => acc + (g.playtime_hours || 0), 0);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const stats = { total, completed, playing, backlog, wishlist, totalHours, completionRate };

    const chartData = [
      { name: 'Wishlist', value: wishlist, color: '#f472b6' },
      { name: 'Backlog', value: backlog, color: '#94a3b8' },
      { name: 'Paused', value: paused, color: '#fbbf24' },
      { name: 'Playing', value: playing, color: '#3b82f6' },
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Dropped', value: dropped, color: '#ef4444' },
    ].filter(item => item.value > 0);

    // Platform distribution
    const platforms = {};
    list.forEach(g => {
        if (g.selected_platform) {
            const p = g.selected_platform;
            platforms[p] = (platforms[p] || 0) + 1;
        }
    });
    
    const platformData = Object.entries(platforms)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5

    const recentGames = [...list]
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5);

    return { stats, chartData, platformData, recentGames };
  }, [games]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading && (!games || games.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading your stats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar user={user} onLogout={handleLogout} onSearchClick={() => setIsAddModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Playtime"
            value={`${Math.round(stats.totalHours * 10) / 10}h`}
            icon={Clock}
            color="bg-blue-500/20"
            iconColor="text-blue-500"
            footer="Hours spent gaming"
          />
          <StatCard
            title="Games Completed"
            value={stats.completed}
            icon={Trophy}
            color="bg-green-500/20"
            iconColor="text-green-500"
            footer={`${stats.completionRate}% completion rate`}
          />
          <StatCard
            title="Currently Playing"
            value={stats.playing}
            icon={Gamepad2}
            color="bg-purple-500/20"
            iconColor="text-purple-500"
            footer="Active sessions"
          />
          <StatCard
            title="Backlog"
            value={stats.backlog}
            icon={List}
            color="bg-gray-500/20"
            iconColor="text-gray-500"
            footer={`${stats.backlog} games waiting`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Chart */}
             {/* Charts */}
             <div className="flex flex-col gap-8">
                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Library Status</h3>
                    <div className="h-[250px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none"/>
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                No data to display
                            </div>
                        )}
                    </div>
                 </div>

                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Platforms</h3>
                    <div className="h-[250px] w-full">
                        {platformData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={platformData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af' }} width={80} />
                                    <Tooltip 
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                No data to display
                            </div>
                        )}
                    </div>
                 </div>
             </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {recentGames.length > 0 ? (
                recentGames.map((game) => (
                    <div key={game.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group cursor-pointer" onClick={() => setSelectedGame(game)}>
                    <img
                        src={game.game?.cover_url || 'https://via.placeholder.com/60'}
                        alt={game.game?.title}
                        className="w-16 h-20 object-cover rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700"
                    />
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{game.game?.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-opacity-10 
                            ${game.status === 'completed' ? 'bg-green-500 text-green-700 dark:text-green-300' : 
                            game.status === 'playing' ? 'bg-blue-500 text-blue-700 dark:text-blue-300' : 'bg-gray-500 text-gray-700 dark:text-gray-300'}`}>
                            {game.status}
                        </span>
                        <span>•</span>
                        <span>{new Date(game.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                ))
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">No games found. Start adding some!</div>
                )}
            </div>
            </div>
        </div>
      </main>

      <GameDetailModal
        isOpen={!!selectedGame}
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
      />
      
      <GameSearchModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, iconColor, footer }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} text-white`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <span className="font-medium">{footer}</span>
      </div>
    </div>
  );
}

export default Dashboard;
