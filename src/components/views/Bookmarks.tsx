import { useEffect, useState } from 'react';
import { supabase, Post, Profile } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { PostCard } from '../post/PostCard';
import { Bookmark as BookmarkIcon } from 'lucide-react';

export function Bookmarks() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<(Post & { profiles: Profile })[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, [profile]);

  const loadBookmarks = async () => {
    const { data: bookmarks } = await supabase
      .from('bookmarks')
      .select('post_id')
      .eq('user_id', profile?.id);

    const postIds = bookmarks?.map((b) => b.post_id) || [];

    if (postIds.length === 0) {
      setPosts([]);
      return;
    }

    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        profiles(*)
      `)
      .in('id', postIds)
      .order('created_at', { ascending: false });

    setPosts(data || []);
  };

  const handleRemoveBookmark = async (postId: string) => {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', profile?.id);

    setPosts(posts.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
        <div className="p-4 flex items-center gap-3">
          <BookmarkIcon className="w-6 h-6" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="p-8 text-center">
          <BookmarkIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Save posts for later</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Bookmark posts to easily find them again in the future.
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => {}}
            onComment={() => {}}
            onShare={() => {}}
            onBookmark={handleRemoveBookmark}
            isBookmarked={true}
          />
        ))
      )}
    </div>
  );
}
