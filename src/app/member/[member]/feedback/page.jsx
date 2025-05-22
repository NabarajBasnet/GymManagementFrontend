'use client'

import React, { useState } from 'react';
import { Star, Send, User, Shield, MessageSquare, Building2, Users, Wrench, Dumbbell, Sparkles, AlertTriangle, Phone, Mail, Globe, Smartphone } from 'lucide-react';

const MemberFeedbackForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    message: '',
    rating: 0,
    detailedRatings: {
      cleanliness: 0,
      equipment: 0,
      staff: 0,
      value: 0
    },
    staffDetails: {
      staffName: '',
      interactionType: ''
    },
    isAnonymous: false,
    source: 'Website'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'Equipment', icon: Wrench, label: 'Equipment' },
    { value: 'Facility', icon: Building2, label: 'Facility' },
    { value: 'Staff', icon: Users, label: 'Staff' },
    { value: 'Classes', icon: Dumbbell, label: 'Classes' },
    { value: 'Membership', icon: User, label: 'Membership' },
    { value: 'Cleanliness', icon: Sparkles, label: 'Cleanliness' },
    { value: 'Safety', icon: Shield, label: 'Safety' },
    { value: 'Other', icon: MessageSquare, label: 'Other' }
  ];

  const sources = [
    { value: 'Mobile App', icon: Smartphone, label: 'Mobile App' },
    { value: 'Website', icon: Globe, label: 'Website' },
    { value: 'In Person', icon: User, label: 'In Person' },
    { value: 'Email', icon: Mail, label: 'Email' },
    { value: 'Phone', icon: Phone, label: 'Phone' }
  ];

  const interactionTypes = [
    'Customer Service',
    'Training',
    'Support',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleStarRating = (field, rating, isDetailed = false) => {
    if (isDetailed) {
      handleNestedInputChange('detailedRatings', field, rating);
    } else {
      handleInputChange(field, rating);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Please select a feedback category';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    if (formData.category === 'Staff' && !formData.staffDetails.staffName.trim()) {
      newErrors.staffName = 'Staff name is required for staff feedback';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        category: '',
        subject: '',
        message: '',
        rating: 0,
        detailedRatings: {
          cleanliness: 0,
          equipment: 0,
          staff: 0,
          value: 0
        },
        staffDetails: {
          staffName: '',
          interactionType: ''
        },
        isAnonymous: false,
        source: 'Website'
      });
      
      alert('Thank you for your feedback! We appreciate your input and will review it shortly.');
    } catch (error) {
      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, size = 20 }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`cursor-pointer transition-colors duration-200 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const OverallStarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5, 6].map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer transition-colors duration-200 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-2">Share Your Feedback</h1>
        <p className="text-blue-100">Help us improve your experience by sharing your thoughts and suggestions</p>
      </div>

      <div onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-b-lg shadow-lg">
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Feedback Category *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange('category', value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  formData.category === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief summary of your feedback"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>

        {/* Overall Rating */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Overall Rating
          </label>
          <div className="flex items-center space-x-3">
            <OverallStarRating
              rating={formData.rating}
              onRatingChange={(rating) => handleStarRating('rating', rating)}
            />
            <span className="text-sm text-gray-600">
              {formData.rating > 0 ? `${formData.rating}/6` : 'No rating'}
            </span>
          </div>
        </div>

        {/* Detailed Ratings */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Detailed Ratings
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(formData.detailedRatings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                <div className="flex items-center space-x-2">
                  <StarRating
                    rating={value}
                    onRatingChange={(rating) => handleStarRating(key, rating, true)}
                  />
                  <span className="text-xs text-gray-500 w-8">
                    {value > 0 ? `${value}/5` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Details (conditional) */}
        {formData.category === 'Staff' && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">Staff Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Name *
                </label>
                <input
                  type="text"
                  value={formData.staffDetails.staffName}
                  onChange={(e) => handleNestedInputChange('staffDetails', 'staffName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter staff member's name"
                />
                {errors.staffName && <p className="text-red-500 text-sm mt-1">{errors.staffName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interaction Type
                </label>
                <select
                  value={formData.staffDetails.interactionType}
                  onChange={(e) => handleNestedInputChange('staffDetails', 'interactionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select interaction type</option>
                  {interactionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Message *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Please provide detailed feedback about your experience..."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
            <p className="text-sm text-gray-500 ml-auto">
              {formData.message.length} characters (minimum 10)
            </p>
          </div>
        </div>

        {/* Source */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            How are you submitting this feedback?
          </label>
          <div className="flex flex-wrap gap-2">
            {sources.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange('source', value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                  formData.source === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Anonymous Option */}
        <div className="mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Submit this feedback anonymously
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-8">
            Anonymous feedback helps us improve while protecting your privacy
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <Send size={18} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberFeedbackForm;