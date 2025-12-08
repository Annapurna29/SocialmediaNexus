import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { Sidebar } from './components/layout/Sidebar';
import { CreatePost } from './components/post/CreatePost';
import { Feed } from './components/views/Feed';
import { Profile } from './components/views/Profile';
import { Explore } from './components/views/Explore';
import { Messages } from './components/views/Messages';
import { Notifications } from './components/views/Notifications';
import { Search } from './components/views/Search';
import { Bookmarks } from './components/views/Bookmarks';
import { Settings } from './components/views/Settings';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup' | null>(null);
  const [activeView, setActiveView] = useState('home');
  const [showCreatePost, setShowCreatePost] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Nexus
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
              Connect with the world
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Share your thoughts, follow your interests, and join the conversation with millions of people around the globe.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <button
                onClick={() => setAuthView('signup')}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition text-lg"
              >
                Sign up
              </button>
              <button
                onClick={() => setAuthView('login')}
                className="px-8 py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-full transition text-lg"
              >
                Log in
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl"></div>
                <div className="flex gap-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {authView === 'login' && (
          <Login
            onClose={() => setAuthView(null)}
            onSwitchToSignup={() => setAuthView('signup')}
          />
        )}
        {authView === 'signup' && (
          <Signup
            onClose={() => setAuthView(null)}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <Feed />;
      case 'search':
        return <Search />;
      case 'explore':
        return <Explore />;
      case 'messages':
        return <Messages />;
      case 'notifications':
        return <Notifications />;
      case 'bookmarks':
        return <Bookmarks />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onCreatePost={() => setShowCreatePost(true)}
      />

      <main className="ml-20 lg:ml-64 min-h-screen">
        {renderView()}
      </main>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setActiveView('home');
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

export default App;
