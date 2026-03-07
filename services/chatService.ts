import { supabase } from '../lib/supabase';

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string,
) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
      })
      .select()
      .single();

    await supabase
      .from('conversations')
      .update({
        last_msg: content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);
    if (error) {
      throw error;
    }
    return { data, error: null };
  } catch (error: any) {
    console.log('Error sending message:', error);
    return { data: null, error: error.message };
  }
};
export const getMessages = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) {
      throw error;
    }
    return { data, error: null };
  } catch (error: any) {
    console.log('Error getting messages:', error);
    return { data: null, error: error.message };
  }
};

export const markMessagesAsRead = async (
  conversationId: string,
  receiverId: string,
) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ isRead: true })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', receiverId)
      .eq('isRead', false);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    console.log('Error marking messages as read:', error);
    return { success: false, error: error.message };
  }
};

export const getConversations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(
        `
        *,
        student:profiles!student_id (id, full_name, avatar_url),
        tutor:profiles!tutor_id (id, full_name, avatar_url),
        messages:messages(sender_id, isRead, created_at)
      `,
      )
      .or(`student_id.eq.${userId},tutor_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Post-process to get the single latest message for each row
    const processedData = data?.map(conv => {
      const messages = conv.messages || [];
      const lastMessage =
        messages.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0] || null;

      return {
        ...conv,
        last_message_details: lastMessage,
      };
    });

    return { data: processedData, error: null };
  } catch (error: any) {
    console.log('Error fetching conversations:', error);
    return { data: null, error: error.message };
  }
};

export const getUnreadConversationsCount = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('conversation_id')
      .eq('receiver_id', userId)
      .eq('isRead', false);

    if (error) throw error;

    // Get unique conversation IDs from the unread messages
    const uniqueConversationIds = new Set(
      data?.map(msg => msg.conversation_id),
    );

    return { count: uniqueConversationIds.size, error: null };
  } catch (error: any) {
    console.error('Error getting unread conversations count:', error);
    return { count: 0, error: error.message };
  }
};

export const deleteConversation = async (conversationId: string) => {
  try {
    // First delete messages belonging to this conversation
    const { error: msgError } = await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId);

    if (msgError) throw msgError;

    // Then delete the conversation row
    const { error: convError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (convError) throw convError;

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error deleting conversation:', error);
    return { success: false, error: error.message };
  }
};
