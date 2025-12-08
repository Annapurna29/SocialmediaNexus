import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Post, Profile } from '../../lib/supabase';
import { formatDistanceToNow } from '../../utils/date';

interface PostCardProps {
  post: Post & { profiles: Profile };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export function PostCard({ post, onLike, onComment, onShare, onBookmark, isLiked, isBookmarked }: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <article className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {post.profiles.avatar_url ? (
            <img src={post.profiles.avatar_url} alt={post.profiles.username} className="w-full h-full rounded-full object-cover" />
          ) : (
            post.profiles.username[0].toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-semibold text-gray-900 dark:text-white truncate">
                {post.profiles.full_name}
              </span>
              <span className="text-gray-500 dark:text-gray-400 truncate">
                @{post.profiles.username}
              </span>
              <span className="text-gray-500 dark:text-gray-400">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDistanceToNow(post.created_at)}
              </span>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-900 dark:text-white mb-3 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {post.media_urls && post.media_urls.length > 0 && (
            <div className={`grid gap-2 mb-3 rounded-xl overflow-hidden ${
              post.media_urls.length === 1 ? 'grid-cols-1' :
              post.media_urls.length === 2 ? 'grid-cols-2' :
              post.media_urls.length === 3 ? 'grid-cols-3' :
              'grid-cols-2'
            }`}>
              {post.media_urls.slice(0, 4).map((url, index) => (
                <div key={index} className="relative bg-gray-100 dark:bg-gray-700 aspect-square">
                  <img
                    src={url}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
            <button
              onClick={() => onComment(post.id)}
              className="flex items-center gap-2 hover:text-blue-500 transition group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm">{post.comments_count}</span>
            </button>

            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 transition group ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <div className={`p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 ${
                isLiked ? 'bg-red-50 dark:bg-red-900/20' : ''
              }`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{post.likes_count}</span>
            </button>

            <button
              onClick={() => onShare(post.id)}
              className="flex items-center gap-2 hover:text-green-500 transition group"
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-sm">{post.shares_count}</span>
            </button>

            <button
              onClick={() => onBookmark(post.id)}
              className={`ml-auto p-2 rounded-full transition ${
                isBookmarked
                  ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
