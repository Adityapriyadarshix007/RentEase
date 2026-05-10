import api from './api';

export const notificationService = {
  // Get unread message count for current user
  getUnreadMessageCount: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 0;
      
      const response = await api.get('/contact/my-messages');
      const messages = response.data.messages || [];
      const unreadCount = messages.filter(msg => msg.status === 'unread' || msg.status === 'read' && !msg.replyMessage).length;
      return unreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },
  
  // Mark message as read when viewed
  markAsRead: async (messageId) => {
    try {
      await api.put(`/contact/${messageId}`, { status: 'read' });
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }
};

export default notificationService;
