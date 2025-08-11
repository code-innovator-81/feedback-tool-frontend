// components/Comments/CommentSection.js
import React, { useState, useRef } from 'react';
import apiClient from '../../utils/apiClient';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import CommentForm from './CommentForm';
import Comment from './Comment';

const CommentSection = ({ 
  feedbackId, 
  comments, 
  onCommentAdded, 
  onCommentUpdated, 
  onCommentDeleted 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleCommentSubmit = async (content) => {
    try {
      setIsSubmitting(true);
      
      const response = await apiClient.post(`/feedback/${feedbackId}/comments`, {
        content: content.trim()
      });

      onCommentAdded(response.data.comment);
      toast.success('Comment added successfully!');
      
      // Reset form if it has a reset method
      if (formRef.current?.resetForm) {
        formRef.current.resetForm();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      const message = error.response?.data?.message || 'Failed to add comment. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentUpdate = async (commentId, content) => {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, {
        content: content.trim()
      });

      onCommentUpdated(commentId, response.data.comment);
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Failed to update comment:', error);
      const message = error.response?.data?.message || 'Failed to update comment. Please try again.';
      toast.error(message);
      throw error; // Re-throw to let the comment component handle it
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.delete(`/comments/${commentId}`);
      onCommentDeleted(commentId);
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      const message = error.response?.data?.message || 'Failed to delete comment. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <div className="mb-8">
        <CommentForm
          ref={formRef}
          onSubmit={handleCommentSubmit}
          isSubmitting={isSubmitting}
          currentUser={user}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to share your thoughts on this feedback.
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={user}
              onUpdate={handleCommentUpdate}
              onDelete={handleCommentDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;