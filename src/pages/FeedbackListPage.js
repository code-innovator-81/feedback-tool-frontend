import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';

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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(category)}`}>
      {category}
    </span>
  );
};

const FeedbackCard = ({ feedback }) => {
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link 
            to={`/feedback/${feedback.id}`}
            className="block group"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
              {feedback.title}
            </h3>
          </Link>
          
          <p className="mt-2 text-gray-600 line-clamp-3">
            {feedback.description.length > 150 
              ? `${feedback.description.substring(0, 150)}...` 
              : feedback.description
            }
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CategoryBadge category={feedback.category} />
              <span className="text-sm text-gray-500">
                by {feedback.user?.name || 'Unknown'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {feedback.comments_count > 0 && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  {feedback.comments_count}
                </span>
              )}
              <span>{formatDate(feedback.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackListPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    'All Categories',
    'bug',
    'feature',
    'improvement'
  ];

  useEffect(() => {
    loadFeedback(currentPage);
  }, [currentPage, filters]);

  const loadFeedback = async (page = 1) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      
      if (filters.category && filters.category !== 'All Categories') {
        params.append('category', filters.category);
      }
      
      if (filters.search.trim()) {
        params.append('search', filters.search.trim());
      }

      const response = await apiClient.get(`/feedback?${params.toString()}`);
      const { data, ...paginationInfo } = response.data;
      
      setFeedback(data);
      setPagination(paginationInfo);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      toast.error('Failed to load feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && currentPage === 1) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Feedback</h1>
          <p className="mt-2 text-gray-600">
            Share your ideas and help us improve our product
          </p>
        </div>
        <Link
          to="/feedback/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition duration-150 ease-in-out"
        >
          Submit Feedback
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category === 'All Categories' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search feedback..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && currentPage > 1 && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {feedback.length === 0 && !loading ? (
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No feedback found</h3>
          <p className="mt-1 text-gray-500">
            {filters.search || filters.category ? 'Try adjusting your filters' : 'Be the first to submit feedback!'}
          </p>
          {!filters.search && !filters.category && (
            <div className="mt-6">
              <Link
                to="/feedback/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Submit Feedback
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {feedback.map((item) => (
              <FeedbackCard key={item.id} feedback={item} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                onPageChange={handlePageChange}
                total={pagination.total}
                perPage={pagination.per_page}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackListPage;