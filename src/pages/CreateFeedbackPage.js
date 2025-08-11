import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { toast } from 'react-toastify';

const CreateFeedbackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'bug',
    'feature',
    'improvement'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/feedback', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category
      });

      toast.success('Feedback submitted successfully!');
      navigate(`/feedback/${response.data.id}`);
    } catch (error) {
      console.error('Submit feedback error:', error);
      
      if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title.trim() || formData.description.trim()) {
      if (window.confirm('Are you sure you want to discard your feedback? All changes will be lost.')) {
        navigate('/feedback');
      }
    } else {
      navigate('/feedback');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit Feedback</h1>
        <p className="mt-2 text-gray-600">
          Help us improve by sharing your thoughts, reporting bugs, or suggesting new features.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              maxLength={100}
              placeholder="Brief summary of your feedback"
              value={formData.title}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              maxLength={1000}
              placeholder="Provide detailed information about your feedback. Include steps to reproduce bugs, specific use cases for features, or any other relevant details."
              value={formData.description}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Category Help Text */}
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Category Guidelines:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Bug Report:</strong> Something isn't working as expected</li>
              <li><strong>Feature Request:</strong> New functionality you'd like to see</li>
              <li><strong>Improvement:</strong> Enhancement to existing features</li>
              <li><strong>General:</strong> Questions, suggestions, or other feedback</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFeedbackPage;