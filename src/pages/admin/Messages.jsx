import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import ConfirmModal from '../../components/ConfirmModal';

export default function ContactMessages() {
  const { contactMessages, markMessageRead, deleteMessage, loading } = useAdmin();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const handleDelete = (id) => {
    setMessageToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (messageToDelete) {
      await deleteMessage(messageToDelete);
      setIsConfirmModalOpen(false);
      setMessageToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsConfirmModalOpen(false);
    setMessageToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-5xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Messages</h2>
      <div className="space-y-4">
        {contactMessages.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center text-gray-500">
            <i className="fas fa-inbox text-5xl mb-4"></i>
            <p>No messages yet</p>
          </div>
        ) : (
          contactMessages.slice().reverse().map(msg => (
            <div key={msg.id} className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${!msg.read ? 'border-[#4169E1] bg-blue-50/50' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{msg.fullName}</h3>
                    {!msg.read && <span className="bg-[#4169E1] text-white text-xs px-2 py-1 rounded-full">New</span>}
                  </div>
                  <p className="text-gray-600 mb-1"><i className="fas fa-envelope mr-2"></i>{msg.email}</p>
                  <p className="text-gray-600 mb-2"><i className="fas fa-phone mr-2"></i>{msg.phoneNumber}</p>
                  <p className="text-gray-700">{msg.message}</p>
                  <p className="text-sm text-gray-500 mt-2">Received: {new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markMessageRead(msg.id)}
                    className="text-[#4169E1] hover:text-[#3658c9] font-medium"
                  >
                    {!msg.read ? 'Mark Read' : 'Mark Unread'}
                  </button>
                  <button
                onClick={() => handleDelete(msg.id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Delete
              </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
      />
    </div>
  );
}
