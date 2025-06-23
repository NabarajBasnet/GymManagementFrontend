'use client'

import toast from 'react-hot-toast';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Star, Send, User, Shield, MessageSquare, Building2, Users, Wrench, Dumbbell, Sparkles, AlertTriangle, Phone, Mail, Globe, Smartphone } from 'lucide-react';
import { useMember } from '@/components/Providers/LoggedInMemberProvider';

const MemberFeedbackForm = () => {

    const {member} = useMember();
    const loggedInmember = member.loggedInMember

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      category: '',
      subject: '',
      rating: 0,
      detailedRatings: {
        cleanliness: 0,
        equipment: 0,
        staff: 0,
        value: 0
      },
      message: '',
      source: '',
      isAnonymous: false
    }
  });

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

  const selectedCategory = watch('category');
  const formValues = watch();

  const StarRating = ({ name, rating, onRatingChange, size = 20, maxStars = 5 }) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
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

  const onSubmit = async (data) => {
    // Prepare data for backend
    const submissionData = {
      ...data,
      memberId: loggedInmember?._id,
    };

    console.log('Data ready for backend:', submissionData);
    
    try {
      const response = await fetch('http://88.198.112.156:8000/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
    
      const responseBody = await response.json();

      if (response.ok) {
      toast.success(responseBody.message);
      reset();
      }else{
        toast.error(responseBody.message);
      }

    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-2">Share Your Feedback</h1>
        <p className="text-blue-100">Help us improve your experience by sharing your thoughts and suggestions</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-6 rounded-b-lg shadow-lg">
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
                onClick={() => setValue('category', value, { shouldValidate: true })}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  selectedCategory === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
          <input
            type="hidden"
            {...register('category', { required: 'Please select a category' })}
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subject *
          </label>
          <input
            {...register('subject', { 
              required: 'Subject is required',
              minLength: {
                value: 3,
                message: 'Subject must be at least 3 characters'
              }
            })}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief summary of your feedback"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
        </div>

        {/* Overall Rating */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Overall Rating
          </label>
          <div className="flex items-center space-x-3">
            <StarRating
              name="rating"
              rating={formValues.rating}
              onRatingChange={(rating) => setValue('rating', rating)}
              size={24}
              maxStars={6}
            />
            <span className="text-sm text-gray-600">
              {formValues.rating > 0 ? `${formValues.rating}/6` : 'No rating'}
            </span>
          </div>
        </div>

        {/* Detailed Ratings */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Detailed Ratings
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(formValues.detailedRatings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                <div className="flex items-center space-x-2">
                  <StarRating
                    name={`detailedRatings.${key}`}
                    rating={value}
                    onRatingChange={(rating) => 
                      setValue(`detailedRatings.${key}`, rating)
                    }
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
        {selectedCategory === 'Staff' && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">Staff Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Name *
                </label>
                <input
                  {...register('staffDetails.staffName', {
                    required: selectedCategory === 'Staff' ? 'Staff name is required' : false
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter staff member's name"
                />
                {errors.staffDetails?.staffName && (
                  <p className="text-red-500 text-sm mt-1">{errors.staffDetails.staffName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interaction Type
                </label>
                <select
                  {...register('staffDetails.interactionType')}
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
            {...register('message', {
              required: 'Message is required',
              minLength: {
                value: 10,
                message: 'Message must be at least 10 characters'
              }
            })}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Please provide detailed feedback about your experience..."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            <p className="text-sm text-gray-500 ml-auto">
              {formValues.message.length} characters (minimum 10)
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
                onClick={() => setValue('source', value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                  formValues.source === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
          <input
            type="hidden"
            {...register('source')}
          />
        </div>

        {/* Anonymous Option */}
        <div className="mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('isAnonymous')}
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
      </form>
    </div>
  );
};

export default MemberFeedbackForm;