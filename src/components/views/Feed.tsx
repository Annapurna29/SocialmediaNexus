import { useEffect, useState } from 'react';
import { supabase, Post, Profile } from '../../lib/supabase';
import { PostCard } from '../post/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function Feed() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<(Post & { profiles: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFeed();
    loadUserInteractions();
  }, [profile]);

  const loadFeed = async () => {
    try {
      const { data: followingData } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', profile?.id);

      const followingIds = followingData?.map(f => f.following_id) || [];
      const userIds = [profile?.id, ...followingIds];

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles(*)
        `)
        .in('user_id', userIds)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInteractions = async () => {
    try {
      const [likesData, bookmarksData] = await Promise.all([
        supabase.from('likes').select('post_id').eq('user_id', profile?.id),
        supabase.from('bookmarks').select('post_id').eq('user_id', profile?.id),
      ]);

      setLikedPosts(new Set(likesData.data?.map(l => l.post_id) || []));
      setBookmarkedPosts(new Set(bookmarksData.data?.map(b => b.post_id) || []));
    } catch (error) {
      console.error('Error loading user interactions:', error);
    }
  };

  const handleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId);

    if (isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', profile?.id);

      await supabase.rpc('decrement_likes_count', { post_id: postId });

      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: profile?.id });

      await supabase.rpc('increment_likes_count', { post_id: postId });

      setLikedPosts(prev => new Set([...prev, postId]));

      const post = posts.find(p => p.id === postId);
      if (post && post.user_id !== profile?.id) {
        await supabase.from('notifications').insert({
          user_id: post.user_id,
          actor_id: profile?.id,
          type: 'like',
          post_id: postId,
        });
      }
    }

    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes_count: post.likes_count + (isLiked ? -1 : 1) }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = async (postId: string) => {
    console.log('Share post:', postId);
  };

  const handleBookmark = async (postId: string) => {
    const isBookmarked = bookmarkedPosts.has(postId);

    if (isBookmarked) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', profile?.id);

      setBookmarkedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      await supabase
        .from('bookmarks')
        .insert({ post_id: postId, user_id: profile?.id });

      setBookmarkedPosts(prev => new Set([...prev, postId]));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Home</h1>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No posts yet. Follow some users or create your first post!
          </p>
        </div>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onBookmark={handleBookmark}
            isLiked={likedPosts.has(post.id)}
            isBookmarked={bookmarkedPosts.has(post.id)}
          />
        ))
      )}
    </div>
  );
}
