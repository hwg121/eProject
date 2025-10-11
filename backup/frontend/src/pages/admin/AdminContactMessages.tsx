import React, { useState, useEffect } from 'react';
import { Mail, Eye, Trash2, X, Calendar, User, MessageSquare } from 'lucide-react';
import Card from '../../components/UI/Card';
import PageHeader from '../../components/UI/PageHeader';
import { contactService } from '../../services/api.ts';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  admin_reply?: string;
  replied_at?: string;
  created_at: string;
}

const AdminContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data: any = await contactService.getAll();
      setMessages(data || []);
    } catch (err) {
      setError('Failed to load contact messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetail(true);
    
    // Mark as read if unread
    if (message.status === 'unread') {
      try {
        await contactService.update(message.id, { status: 'read' });
        loadMessages();
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.delete(id);
        loadMessages();
      } catch (err) {
        setError('Failed to delete message');
        console.error('Error deleting message:', err);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      unread: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-green-100 text-green-800'
    };
    return badges[status as keyof typeof badges] || badges.read;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact Messages"
        subtitle="View and manage contact form submissions"
        icon={<Mail className="h-10 w-10" />}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {messages.filter(m => m.status === 'unread').length}
            </div>
            <div className="text-sm text-gray-600">Unread Messages</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {messages.filter(m => m.status === 'replied').length}
            </div>
            <div className="text-sm text-gray-600">Replied</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {messages.length}
            </div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </div>
        </Card>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-emerald-800">All Messages</h2>
        {messages.length === 0 ? (
          <Card className="p-12 text-center">
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No messages yet</p>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(message.status)}`}>
                      {message.status}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(message.created_at).toLocaleString()}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">{message.subject}</h3>
                  <div className="flex items-center space-x-4 text-sm text-emerald-600">
                    <span className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{message.name}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{message.email}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 line-clamp-2">{message.message}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleView(message)}
                    className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-800">Message Details</h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-emerald-800 font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-emerald-800 font-medium">{selectedMessage.email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Subject</label>
                  <p className="text-emerald-800 font-semibold text-lg">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Message</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {selectedMessage.admin_reply && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Admin Reply</label>
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <p className="text-emerald-800 whitespace-pre-wrap">{selectedMessage.admin_reply}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Replied on: {selectedMessage.replied_at ? new Date(selectedMessage.replied_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetail(false)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;

