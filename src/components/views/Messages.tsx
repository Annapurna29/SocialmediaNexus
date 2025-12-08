import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { supabase, Message, Conversation, Profile } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from '../../utils/date';

type ConversationWithProfile = Conversation & {
  otherUser: Profile;
  lastMessage: Message | null;
};

export function Messages() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithProfile[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithProfile | null>(null);
  const [messages, setMessages] = useState<(Message & { profiles: Profile })[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadConversations();
  }, [profile]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);

      const subscription = supabase
        .channel(`conversation:${selectedConversation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation.id}`,
          },
          () => {
            loadMessages(selectedConversation.id);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .contains('participant_ids', [profile?.id])
      .order('last_message_at', { ascending: false });

    if (!data) return;

    const conversationsWithProfiles = await Promise.all(
      data.map(async (conv) => {
        const otherUserId = conv.participant_ids.find((id: string) => id !== profile?.id);
        const { data: otherUser } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .maybeSingle();

        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          ...conv,
          otherUser: otherUser!,
          lastMessage,
        };
      })
    );

    setConversations(conversationsWithProfiles);
  };

  const loadMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        profiles(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    setMessages(data || []);

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', profile?.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    await supabase.from('messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: profile?.id,
      content: newMessage.trim(),
    });

    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', selectedConversation.id);

    setNewMessage('');
    loadConversations();
  };

  return (
    <div className="max-w-5xl mx-auto h-screen flex">
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-5rem)]">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                selectedConversation?.id === conv.id ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {conv.otherUser?.avatar_url ? (
                  <img
                    src={conv.otherUser.avatar_url}
                    alt={conv.otherUser.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  conv.otherUser?.username[0].toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white truncate">
                    {conv.otherUser?.full_name}
                  </span>
                  {conv.lastMessage && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(conv.lastMessage.created_at)}
                    </span>
                  )}
                </div>
                {conv.lastMessage && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {conv.lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                  {selectedConversation.otherUser?.avatar_url ? (
                    <img
                      src={selectedConversation.otherUser.avatar_url}
                      alt={selectedConversation.otherUser.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    selectedConversation.otherUser?.username[0].toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {selectedConversation.otherUser?.full_name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{selectedConversation.otherUser?.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isSent = message.sender_id === profile?.id;
                return (
                  <div key={message.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl ${
                        isSent
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${isSent ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {formatDistanceToNow(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
