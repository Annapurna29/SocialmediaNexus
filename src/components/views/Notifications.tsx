import { useEffect, useState } from 'react';
import { supabase, Notification } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/date';

export function Notifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
    markAllAsRead();

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile?.id}`,
        },
        (payload) => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [profile]);

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select(`
        *,
        profiles:actor_id(*)
      `)
      .eq('user_id', profile?.id)
      .order('created_at', { ascending: false })
      .limit(50);

    setNotifications(data || []);
  };

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', profile?.id)
      .eq('is_read', false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-6 h-6 text-red-500 fill-current" />;
      case 'comment':
        return <MessageCircle className="w-6 h-6 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-6 h-6 text-green-500" />;
      case 'mention':
        return <AtSign className="w-6 h-6 text-purple-500" />;
      default:
        return null;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const actorName = notification.profiles?.full_name || 'Someone';
    switch (notification.type) {
      case 'like':
        return `${actorName} liked your post`;
      case 'comment':
        return `${actorName} commented on your post`;
      case 'follow':
        return `${actorName} started following you`;
      case 'mention':
        return `${actorName} mentioned you in a post`;
      default:
        return 'New notification';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-4 p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${
                !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {notification.profiles?.avatar_url ? (
                      <img
                        src={notification.profiles.avatar_url}
                        alt={notification.profiles.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      notification.profiles?.username[0].toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white">
                      <span className="font-semibold">{notification.profiles?.full_name}</span>
                      {' '}
                      <span className="text-gray-600 dark:text-gray-400">
                        {getNotificationText(notification).split(notification.profiles?.full_name || '')[1]}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(notification.created_at)} ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
