import { useState } from 'react';
import { X, Image, Smile } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface CreatePostProps {
  onClose: () => void;
  onPostCreated: () => void;
}

export function CreatePost({ onClose, onPostCreated }: CreatePostProps) {
  const { profile } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!content.trim() && !loading) return;

    setLoading(true);
    setError('');

    try {
      const hashtags = content.match(/#\w+/g) || [];
      const uniqueHashtags = [...new Set(hashtags.map(tag => tag.slice(1).toLowerCase()))];

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: profile?.id,
          content: content.trim(),
          media_type: 'text',
        })
        .select()
        .single();

      if (postError) throw postError;

      for (const tagName of uniqueHashtags) {
        const { data: hashtag } = await supabase
          .from('hashtags')
          .select('id')
          .eq('name', tagName)
          .maybeSingle();

        let hashtagId;

        if (hashtag) {
          hashtagId = hashtag.id;
          await supabase
            .from('hashtags')
            .update({ posts_count: supabase.raw('posts_count + 1') })
            .eq('id', hashtagId);
        } else {
          const { data: newHashtag } = await supabase
            .from('hashtags')
            .insert({ name: tagName, posts_count: 1 })
            .select('id')
            .single();
          hashtagId = newHashtag?.id;
        }

        if (hashtagId) {
          await supabase
            .from('post_hashtags')
            .insert({ post_id: post.id, hashtag_id: hashtagId });
        }
      }

      await supabase
        .from('profiles')
        .update({ posts_count: supabase.raw('posts_count + 1') })
        .eq('id', profile?.id);

      onPostCreated();
      onClose();
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              profile?.username[0].toUpperCase()
            )}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="flex-1 resize-none border-none focus:ring-0 text-lg bg-transparent dark:text-white placeholder-gray-400 min-h-[120px]"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500">
              <Image className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
