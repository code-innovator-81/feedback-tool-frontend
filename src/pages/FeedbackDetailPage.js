// pages/FeedbackDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import CommentSection from '../components/Comments/CommentSection';

const CategoryBadge = ({ category }) => {
  const getColorClass = (category) => {
    switch (category.toLowerCase()) {
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      case 'improvement':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getColorClass(category)}`}>
      {category}
    </span>
  );
};

const FeedbackDetailPage = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    loadFeedbackDetail();
  }, [id]);

  const loadFeedbackDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/feedback/${id}`);
      setFeedback(response.data.feedback);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      toast.error('Failed to load feedback details');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [...prev, newComment]);
  };

  const handleCommentUpdated = (commentId, updatedComment) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDescription = (text) => {
    // Simple text formatting - replace newlines with <br> tags
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!feedback) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-12 text-center">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 4a7.962 7.962 0 01-6 7.291"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Feedback not found</h3>
          <p className="mt-1 text-gray-500">
            The feedback you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/feedback"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Feedback List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <Link to="/feedback" className="text-gray-400 hover:text-gray-500">
              <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0L3 9.414a1 1 0 010-1.414L8.293 2.707a1 1 0 011.414 1.414L4.414 9l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">Back to feedback</span>
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/feedback" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                All Feedback
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                {feedback.title}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Feedback Detail Card */}
      <div className="bg-white shadow rounded-lg p-8 mb-8">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <CategoryBadge category={feedback.category} />
            <span className="text-sm text-gray-500">
              {formatDate(feedback.created_at)}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {feedback.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {feedback.user?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <span className="ml-2">
                Submitted by <span className="font-medium text-gray-700">{feedback.user?.name || 'Unknown'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {formatDescription(feedback.description)}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow rounded-lg p-8">
        <CommentSection
          feedbackId={feedback.id}
          comments={comments}
          onCommentAdded={handleCommentAdded}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
        />
      </div>
    </div>
  );
};

export default FeedbackDetailPage;