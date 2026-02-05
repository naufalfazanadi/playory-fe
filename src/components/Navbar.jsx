import { Link, useLocation } from 'react-router-dom';
import { LogOut, Plus, LayoutDashboard, KanbanSquare, Moon, Sun, Library as LibraryIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoInline from '../assets/logo_inline_trans.png';

function Navbar({ user, onLogout, onSearchClick }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full transition-all border-b border-gray-200/60 dark:border-gray-800/60 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={logoInline} 
                alt="Playory" 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
              />
            </Link>
            
            <nav className="hidden md:flex gap-1 items-center p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive('/dashboard') 
                    ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                to="/library" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive('/library') 
                    ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <LibraryIcon className="w-4 h-4" />
                Library
              </Link>
              <Link 
                to="/board" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive('/board') 
                    ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <KanbanSquare className="w-4 h-4" />
                Board
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
             {/* Mobile Nav Link (if hidden above) - simplistic approach for now */}
            <div className="md:hidden flex gap-2 mr-2">
                <Link to="/dashboard" className={`p-2 rounded-lg ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}><LayoutDashboard/></Link>
                <Link to="/library" className={`p-2 rounded-lg ${isActive('/library') ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}><LibraryIcon/></Link>
                <Link to="/board" className={`p-2 rounded-lg ${isActive('/board') ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}><KanbanSquare/></Link>
            </div>

            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden md:block">
              {user?.name}
            </span>
            
            {onSearchClick && (
              <button 
                onClick={onSearchClick}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200 active:scale-95 group"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                <span className="hidden sm:inline">Add Game</span>
              </button>
            )}
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all active:rotate-12"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/10 dark:hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
