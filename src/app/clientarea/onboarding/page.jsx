'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Upload, Check, Building2, MapPin, CreditCard, Crown, Settings, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GymOnboarding() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Business Info
        gymName: '',
        gymType: '',
        businessEmail: '',
        websiteUrl: '',
        logo: null,

        // Step 2: Location & Locale
        country: '',
        state: '',
        city: '',
        timezone: 'UTC-05:00 (EST)',
        currency: 'USD',
        language: 'English',

        // Step 3: Billing & Payments
        billingAddress: '',
        vatId: '',
        invoicingEmail: '',
        paymentMethod: '',

        // Step 4: Plan Selection
        selectedPlan: 'pro',

        // Step 5: Initial Setup
        branchName: '',
        branchLocation: '',
        staffName: '',
        staffEmail: '',
        brandColors: '#6366f1',
        businessHours: { open: '06:00', close: '22:00' }
    });

    const totalSteps = 4;

    const steps = [
        { id: 1, title: 'Business Info', icon: Building2 },
        { id: 2, title: 'Location & Locale', icon: MapPin },
        { id: 3, title: 'Billing & Payments', icon: CreditCard },
        { id: 4, title: 'Complete', icon: CheckCircle }
    ];

    const gymTypes = [
        'CrossFit', 'Yoga Studio', 'Fitness Center', 'Martial Arts', 'Boxing', 'Pilates', 'Dance Studio', 'Personal Training'
    ];

    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy'
    ];

    const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian'];

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            price: '$29',
            period: '/month',
            features: ['Up to 100 members', 'Basic reporting', 'Email support', '1 location'],
            popular: false
        },
        {
            id: 'pro',
            name: 'Professional',
            price: '$79',
            period: '/month',
            features: ['Up to 500 members', 'Advanced analytics', 'Priority support', '3 locations', 'Mobile app'],
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: '$199',
            period: '/month',
            features: ['Unlimited members', 'Custom integrations', '24/7 support', 'Unlimited locations', 'White label'],
            popular: false
        }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleFileUpload = (field) => {
        // Placeholder for file upload
        console.log(`File upload for ${field}`);
    };

    const renderProgressBar = () => (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
        </div>
    );

    const renderStepIndicator = () => (
        <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <div key={step.id} className="flex items-center">
                            <div className={`flex items-center justify-center p-2 rounded-full border-2 transition-all ${isCompleted
                                ? 'bg-green-500 border-green-500 text-white'
                                : isActive
                                    ? 'bg-indigo-500 border-indigo-500 text-white'
                                    : 'border-gray-300 text-gray-400'
                                }`}>
                                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <span className={`ml-2 text-sm font-medium ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                {step.title}
                            </span>
                            {index < steps.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-gray-300 mx-4" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your gym</h2>
                <p className="text-gray-600">Let's start with the basics about your fitness business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gym Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        value={formData.gymName}
                        onChange={(e) => handleInputChange('gymName', e.target.value)}
                        className="w-full px-4 py-6 border border-gray-300 rounded-sm dark:bg-transparent bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your gym name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gym Type</label>
                    <select
                        value={formData.gymType}
                        onChange={(e) => handleInputChange('gymType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm dark:bg-transparent bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">Select gym type</option>
                        {gymTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                    <Input
                        type="email"
                        value={formData.businessEmail}
                        onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                        className="w-full px-4 py-6 border border-gray-300 rounded-sm dark:bg-transparent bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="business@yourgym.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                    <Input
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        className="w-full px-4 py-6 border border-gray-300 rounded-sm dark:bg-transparent bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://yourgym.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
                    <div
                        onClick={() => handleFileUpload('logo')}
                        className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors"
                    >
                        <div className="text-center">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs font-medium text-gray-500">Click to upload logo</p>
                        </div>
                    </div>
                </div>


            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Color</label>
                    <div className="flex items-center space-x-3">
                        <Input
                            type="color"
                            value={formData.brandColors}
                            onChange={(e) => handleInputChange('brandColors', e.target.value)}
                            className="w-12 h-12 border border-gray-300 rounded-full dark:bg-transparent bg-transparent cursor-pointer"
                        />
                        <Input
                            type="text"
                            value={formData.brandColors}
                            onChange={(e) => handleInputChange('brandColors', e.target.value)}
                            className="flex-1 px-4 py-6 border border-gray-300 rounded-sm dark:bg-transparent bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                    <div className="flex items-center space-x-3">
                        <Input
                            type="time"
                            className="px-4 py-6 border border-gray-300 rounded-sm dark:bg-transparent bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                            type="time"
                            className="px-4 py-6 border border-gray-300 rounded-sm dark:bg-transparent bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Location & Preferences</h2>
                <p className="text-gray-600">Configure your location and regional settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-3 rounded-sm dark:bg-transparent bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">Select country</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                    <Input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-4 py-6 rounded-sm dark:bg-transparent bg-transparent border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter state or province"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-6 rounded-sm dark:bg-transparent bg-transparent border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter city"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <Input
                        type="text"
                        value={formData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="w-full px-4 py-6 rounded-sm dark:bg-transparent bg-transparent border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Auto-detected timezone"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-4 py-3 rounded-sm dark:bg-transparent bg-transparent border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-4 py-3 rounded-sm dark:bg-transparent bg-transparent border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        {languages.map(language => (
                            <option key={language} value={language}>{language}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h2>
                <p className="text-gray-600">Set up your billing information and payment methods</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                    <textarea
                        value={formData.billingAddress}
                        onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                        className="w-full px-4 py-3 rounded-sm dark:bg-transparent bg-transparent border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows="3"
                        placeholder="Enter your billing address"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">VAT ID / Tax ID</label>
                        <Input
                            type="text"
                            value={formData.vatId}
                            onChange={(e) => handleInputChange('vatId', e.target.value)}
                            className="w-full px-4 py-6 rounded-sm dark:bg-transparent bg-transparent border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Optional"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoicing Email</label>
                        <Input
                            type="email"
                            value={formData.invoicingEmail}
                            onChange={(e) => handleInputChange('invoicingEmail', e.target.value)}
                            className="w-full px-4 py-6 rounded-sm dark:bg-transparent bg-transparent border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="billing@yourgym.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CreditCard className="w-6 h-6 text-gray-400 mr-3" />
                                <span className="text-gray-600 text-sm font-medium">Connect Stripe for payments</span>
                            </div>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                Setup Stripe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Welcome to Your Gym Management System!</h2>
                <p className="text-sm font-medium text-gray-600 mb-8">
                    Congratulations! Your gym setup is complete and ready to go.
                </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-indigo-600">1</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Add Members</h4>
                            <p className="text-sm text-gray-600">Start adding your gym members and their details</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-indigo-600">2</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Set Up Classes</h4>
                            <p className="text-sm text-gray-600">Create your class schedules and programs</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-indigo-600">3</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Start Billing</h4>
                            <p className="text-sm text-gray-600">Configure membership plans and payments</p>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => router.push('/clientarea/dashboard')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105">
                Go to Dashboard
            </button>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            default: return renderStep1();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Liftora
                        </h1>
                        <p className="text-gray-600 text-sm font-medium">Let's get your gym set up in just a few minutes</p>
                    </div>

                    {/* Progress Bar */}
                    {renderProgressBar()}

                    {/* Step Indicator */}
                    {currentStep < 5 && renderStepIndicator()}

                    {/* Main Content */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        {renderCurrentStep()}
                    </div>

                    {/* Navigation Buttons */}
                    {currentStep < 4 && (
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${currentStep === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Previous
                            </button>

                            <div className="flex space-x-3">
                                <button
                                    onClick={handleSkip}
                                    className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition-all"
                                >
                                    Skip for now
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
                                >
                                    {currentStep === totalSteps - 1 ? 'Complete Setup' : 'Next'}
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
