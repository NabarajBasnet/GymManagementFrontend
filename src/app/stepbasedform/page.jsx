'use client';

import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, User, Mail, Building, Send } from 'lucide-react';


function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    message: '',
  });

  const totalSteps = 4;

  const updateFormData = () => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 flex flex-col items-center justify-center">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-indigo-700 transition-colors"
      >
        Open Form
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-semibold">Get in Touch</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-6 pt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center ${
                      idx + 1 <= currentStep ? 'text-indigo-600' : ''
                    }`}
                  >
                    <CheckCircle2 size={16} className="mr-1" />
                    Step {idx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Form content */}
            <div className="p-6">
              <div className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-600 mb-4">
                      <User size={24} />
                      <h3 className="text-xl font-semibold">Personal Info</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-600 mb-4">
                      <Mail size={24} />
                      <h3 className="text-xl font-semibold">Contact Details</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-600 mb-4">
                      <Building size={24} />
                      <h3 className="text-xl font-semibold">Company Info</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => updateFormData('company', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-600 mb-4">
                      <Send size={24} />
                      <h3 className="text-xl font-semibold">Message</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => updateFormData('message', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
                        placeholder="Write your message here..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 flex justify-between items-center">
              <button
                onClick={handlePrev}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                disabled={currentStep === 1}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <button
                onClick={handleNext}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
                  currentStep === totalSteps
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white transition-colors`}
              >
                {currentStep === totalSteps ? 'Submit' : 'Next'}
                {currentStep !== totalSteps && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;