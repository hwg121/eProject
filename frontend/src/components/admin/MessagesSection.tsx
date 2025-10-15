import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import { ContactMessage } from '../../types/admin';

interface MessagesSectionProps {
  contactMessages: ContactMessage[];
  isDarkMode: boolean;
  onMessageStatusChange: (messageId: string, newStatus: 'unread' | 'read' | 'replied') => void;
  onDeleteMessage: (messageId: string) => void;
}

const MessagesSection: React.FC<MessagesSectionProps> = ({
  contactMessages,
  isDarkMode,
  onMessageStatusChange,
  onDeleteMessage
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-100' : 'text-gray-800'}`}>
          Contact Messages ({contactMessages.length})
        </h3>
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
            Unread: {contactMessages.filter(msg => msg.status === 'unread').length}
          </span>
        </div>
      </div>

      {contactMessages.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No messages yet. When users submit the contact form, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contactMessages
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((message) => (
            <motion.div
              key={message.id}
              className={`border rounded-lg p-6 transition-all duration-300 ${
                message.status === 'unread'
                  ? isDarkMode
                    ? 'border-emerald-500/30 bg-emerald-900/20'
                    : 'border-emerald-200 bg-emerald-50'
                  : isDarkMode
                    ? 'border-gray-700 bg-gray-800/30'
                    : 'border-gray-200 bg-gray-50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {message.subject}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      message.status === 'unread'
                        ? 'bg-red-100 text-red-800'
                        : message.status === 'read'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {message.status}
                    </span>
                  </div>
                  <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>From:</strong> {message.name} ({message.email})
                  </div>
                  <div className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={message.status}
                    onChange={(e) => onMessageStatusChange(message.id, e.target.value as 'unread' | 'read' | 'replied')}
                    className={`px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <motion.button
                    onClick={() => onDeleteMessage(message.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700/30' : 'bg-white'
              }`}>
                <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {message.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default MessagesSection;
