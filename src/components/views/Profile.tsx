import { useEffect, useState } from 'react';
import { Calendar, MapPin, Link as LinkIcon, Edit2 } from 'lucide-react';
import { supabase, Post, Profile as ProfileType } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { PostCard } from '../post/PostCard';
import { formatFullDate } from '../../utils/date';

export function Profile() {
  const { profile: currentProfile, updateProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    if (currentProfile) {
      setProfile(currentProfile);
      setEditForm({
        full_name: currentProfile.full_name || '',
        bio: currentProfile.bio || '',
        location: currentProfile.location || '',
        website: currentProfile.website || '',
      });
      loadPosts(currentProfile.id);
      checkFollowStatus(currentProfile.id);
    }
  }, [currentProfile]);

  const loadPosts = async (userId: string) => {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        profiles(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setPosts(data || []);
  };

  const checkFollowStatus = async (userId: string) => {
    if (userId === currentProfile?.id) return;

    const { data } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentProfile?.id)
      .eq('following_id', userId)
      .maybeSingle();

    setIsFollowing(!!data);
  };

  const handleFollow = async () => {
    if (!profile) return;

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentProfile?.id)
        .eq('following_id', profile.id);
    } else {
      await supabase
        .from('follows')
        .insert({
          follower_id: currentProfile?.id,
          following_id: profile.id,
        });

      await supabase.from('notifications').insert({
        user_id: profile.id,
        actor_id: currentProfile?.id,
        type: 'follow',
      });
    }

    setIsFollowing(!isFollowing);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) return null;

  const isOwnProfile = profile.id === currentProfile?.id;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500">
          {profile.cover_url && (
            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="px-4 pb-4">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.username[0].toUpperCase()
              )}
            </div>

            {isOwnProfile ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-16 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className={`mt-16 px-6 py-2 rounded-full font-semibold ${
                  isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.full_name}</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-3">@{profile.username}</p>

              {profile.bio && (
                <p className="text-gray-900 dark:text-white mb-3">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400 text-sm mb-4">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatFullDate(profile.created_at)}</span>
                </div>
              </div>

              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{profile.following_count}</span>
                  <span className="text-gray-500 dark:text-gray-400"> Following</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{profile.followers_count}</span>
                  <span className="text-gray-500 dark:text-gray-400"> Followers</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex border-t border-gray-200 dark:border-gray-800">
          {(['posts', 'replies', 'media', 'likes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 font-semibold capitalize ${
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

      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{ ...post, profiles: profile }}
            onLike={() => {}}
            onComment={() => {}}
            onShare={() => {}}
            onBookmark={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
