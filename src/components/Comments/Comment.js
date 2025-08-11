// components/Comments/Comment.js
import React, { useState } from 'react';

const Comment = ({ comment, currentUser, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const canEdit = currentUser && currentUser.id === comment.user_id;
  const canDelete = currentUser && (currentUser.id === comment.user_id || currentUser.role === 'admin');

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    
    try {
      setIsUpdating(true);
      await onUpdate(comment.id, editContent);
      setIsEditing(false);
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    onDelete(comment.id);
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    // For older comments, show full date
    return commentDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (text) => {
    return text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // @ mentions
      .replace(/@(\w+)/g, '<span class="text-indigo-600 font-medium">@$1</span>')
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="flex space-x-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {comment.user?.name?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
      </div>

      {/* Comment Content */}
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm text-gray-900">
                {comment.user?.name || 'Unknown User'}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.created_at)}
                {comment.updated_at !== comment.created_at && (
                  <span className="ml-1">(edited)</span>
                )}
              </span>
            </div>
            
            {/* Actions */}
            {(canEdit || canDelete) && (
              <div className="flex items-center space-x-2">
                {canEdit && !isEditing && (
                  <button
                    onClick={handleEdit}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Edit
                  </button>
                )}
                {canDelete && !isEditing && (
                  <button
                    onClick={handleDelete}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {editContent.length}/500 characters
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isUpdating || !editContent.trim() || editContent === comment.content}
                    className={`px-3 py-1 text-xs rounded ${
                      isUpdating || !editContent.trim() || editContent === comment.content
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 inline" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="text-sm text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: formatContent(comment.content) 
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;