import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, User, LogOut, Moon, Sun, Bookmark, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onCreatePost: () => void;
}

export function Sidebar({ activeView, onViewChange, onCreatePost }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'notifications', icon: Heart, label: 'Notifications' },
    { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col p-4">
      <div className="mb-8 flex items-center justify-center lg:justify-start px-2">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          <span className="hidden lg:inline">Nexus</span>
          <span className="lg:hidden">N</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="hidden lg:inline font-medium">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={onCreatePost}
          className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
        >
          <PlusSquare className="w-6 h-6" />
          <span className="hidden lg:inline">Create</span>
        </button>
      </nav>

      <div className="space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          <span className="hidden lg:inline font-medium">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden lg:inline font-medium">Logout</span>
        </button>

        {profile && (
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.username[0].toUpperCase()
              )}
            </div>
            <div className="hidden lg:block flex-1 overflow-hidden">
              <p className="font-medium text-gray-900 dark:text-white truncate">{profile.full_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{profile.username}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
