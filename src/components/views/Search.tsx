import { useState, useCallback } from 'react';
import { Search as SearchIcon, User, Hash, Loader2 } from 'lucide-react';
import { supabase, Profile } from '../../lib/supabase';

type SearchResult = {
  type: 'user' | 'hashtag';
  data: Profile | { id: string; name: string; posts_count: number };
};

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'hashtags'>('all');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);

    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length < 1) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const isHashtagSearch = trimmedQuery.startsWith('#');
      const cleanQuery = isHashtagSearch ? trimmedQuery.slice(1).toLowerCase() : trimmedQuery.toLowerCase();

      const searchResults: SearchResult[] = [];

      if (activeTab === 'all' || activeTab === 'users') {
        try {
          const { data: users, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .or(`username.ilike.%${cleanQuery}%,full_name.ilike.%${cleanQuery}%`)
            .limit(15);

          if (userError) {
            console.error('User search error:', userError);
          } else if (users) {
            users.forEach((user) => {
              searchResults.push({ type: 'user', data: user });
            });
          }
        } catch (error) {
          console.error('Error searching users:', error);
        }
      }

      if (activeTab === 'all' || activeTab === 'hashtags') {
        try {
          const { data: hashtags, error: hashtagError } = await supabase
            .from('hashtags')
            .select('*')
            .ilike('name', `%${cleanQuery}%`)
            .order('posts_count', { ascending: false })
            .limit(15);

          if (hashtagError) {
            console.error('Hashtag search error:', hashtagError);
          } else if (hashtags) {
            hashtags.forEach((hashtag) => {
              searchResults.push({ type: 'hashtag', data: hashtag });
            });
          }
        } catch (error) {
          console.error('Error searching hashtags:', error);
        }
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [activeTab]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
        <div className="p-4">
          <div className="relative">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
            ) : (
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users (@username) or hashtags (#tag)..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              autoFocus
            />
          </div>
        </div>

        <div className="flex border-t border-gray-200 dark:border-gray-800">
          {(['all', 'users', 'hashtags'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                handleSearch(query);
              }}
              className={`flex-1 py-3 font-semibold capitalize ${
                activeTab === tab
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900">
        {isSearching && (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Searching...</p>
          </div>
        )}

        {!isSearching && results.length === 0 && query.length >= 1 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
          </div>
        )}

        {!isSearching && results.length === 0 && query.length < 1 && (
          <div className="p-8 text-center">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Search Tips</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Search for users by name or username (@alex_chen)</li>
                  <li>• Search for hashtags (#design, #rust, #react)</li>
                  <li>• Try partial matches (e.g., "alex" finds "alex_chen")</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {results.map((result, index) => (
          <div
            key={`${result.type}-${index}`}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-800 cursor-pointer"
          >
            {result.type === 'user' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {(result.data as Profile).avatar_url ? (
                    <img
                      src={(result.data as Profile).avatar_url}
                      alt={(result.data as Profile).username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    (result.data as Profile).username[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {(result.data as Profile).full_name}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 truncate">
                    @{(result.data as Profile).username}
                  </p>
                  {(result.data as Profile).bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                      {(result.data as Profile).bio}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Hash className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      #{(result.data as { name: string }).name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(result.data as { posts_count: number }).posts_count} posts
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
