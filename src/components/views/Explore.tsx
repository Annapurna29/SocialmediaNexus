import { useEffect, useState } from 'react';
import { supabase, Post, Profile } from '../../lib/supabase';
import { PostCard } from '../post/PostCard';
import { TrendingUp } from 'lucide-react';

type Hashtag = {
  id: string;
  name: string;
  posts_count: number;
};

export function Explore() {
  const [posts, setPosts] = useState<(Post & { profiles: Profile })[]>([]);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  useEffect(() => {
    loadTrendingHashtags();
    loadExplorePosts();
  }, []);

  const loadTrendingHashtags = async () => {
    const { data } = await supabase
      .from('hashtags')
      .select('*')
      .order('posts_count', { ascending: false })
      .limit(10);

    setHashtags(data || []);
  };

  const loadExplorePosts = async (hashtagName?: string) => {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles(*)
      `)
      .order('likes_count', { ascending: false });

    if (hashtagName) {
      const { data: hashtagData } = await supabase
        .from('hashtags')
        .select('id')
        .eq('name', hashtagName)
        .maybeSingle();

      if (hashtagData) {
        const { data: postHashtags } = await supabase
          .from('post_hashtags')
          .select('post_id')
          .eq('hashtag_id', hashtagData.id);

        const postIds = postHashtags?.map(ph => ph.post_id) || [];
        query = query.in('id', postIds);
      }
    }

    const { data } = await query.limit(50);
    setPosts(data || []);
  };

  const handleHashtagClick = (hashtagName: string) => {
    setSelectedHashtag(hashtagName);
    loadExplorePosts(hashtagName);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Explore</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Hashtags
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedHashtag(null);
                  loadExplorePosts();
                }}
                className={`w-full text-left p-3 rounded-lg transition ${
                  !selectedHashtag
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="font-semibold">All Posts</div>
              </button>
              {hashtags.map((hashtag) => (
                <button
                  key={hashtag.id}
                  onClick={() => handleHashtagClick(hashtag.name)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedHashtag === hashtag.name
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">#{hashtag.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {hashtag.posts_count} {hashtag.posts_count === 1 ? 'post' : 'posts'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No posts found</p>
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => {}}
                  onComment={() => {}}
                  onShare={() => {}}
                  onBookmark={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
