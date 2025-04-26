'use client';

import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useState } from 'react';
import {
    Eye,
    EyeOff,
    AlertTriangle,
    Info,
    Bell,
    BellOff,
    Mail,
    Phone,
    Trash2
} from 'lucide-react';

const SettingsSection = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex.johnson@example.com',
        phone: '(555) 123-4567',
        notifications: {
            email: true,
            sms: false,
            app: true
        }
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleNotification = (type) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type]
            }
        }));
    };

    const validatePersonalInfo = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordChange = () => {
        const newErrors = {};
        if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePersonalInfoSubmit = (e) => {
        e.preventDefault();
        if (!validatePersonalInfo()) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccessMessage('Personal information updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1000);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!validatePasswordChange()) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccessMessage('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1000);
    };

    const handleNotificationsSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccessMessage('Notification preferences saved!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 800);
    };

    const confirmAccountDeletion = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Handle account deletion
            alert('Account deletion requested. This may take a few moments.');
        }
    };

    const confirmMembershipCancellation = () => {
        if (window.confirm('Are you sure you want to cancel your membership?')) {
            // Handle membership cancellation
            alert('Membership cancellation requested. We\'re sorry to see you go!');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-900 flex items-center">
                        <FaUser className="mr-2 h-5 w-5 text-gray-500" />
                        Personal Information
                    </h3>
                </div>
                <div className="p-6">
                    <form onSubmit={handlePersonalInfoSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`block w-full p-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="mr-1 h-4 w-4" />
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`block w-full p-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="mr-1 h-4 w-4" />
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`block w-full p-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="mr-1 h-4 w-4" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`block w-full p-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="mr-1 h-4 w-4" />
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {isSubmitting ? 'Saving...' : 'Update Information'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-900 flex items-center">
                        <FaLock className="mr-2 h-5 w-5 text-gray-500" />
                        Change Password
                    </h3>
                </div>
                <div className="p-6">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className={`block w-full p-2 border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertTriangle className="mr-1 h-4 w-4" />
                                    {errors.currentPassword}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className={`block w-full p-2 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertTriangle className="mr-1 h-4 w-4" />
                                    {errors.newPassword}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className={`block w-full p-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertTriangle className="mr-1 h-4 w-4" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {isSubmitting ? 'Updating...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-900 flex items-center">
                        <Bell className="mr-2 h-5 w-5 text-gray-500" />
                        Notification Settings
                    </h3>
                </div>
                <div className="p-6">
                    <form onSubmit={handleNotificationsSubmit}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                        <p className="text-sm text-gray-500">Receive updates via email</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.notifications.email}
                                        onChange={() => toggleNotification('email')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                                        <p className="text-sm text-gray-500">Receive updates via text message</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.notifications.sms}
                                        onChange={() => toggleNotification('sms')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <Bell className="h-5 w-5 text-gray-500 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">App Notifications</h4>
                                        <p className="text-sm text-gray-500">Receive in-app notifications</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.notifications.app}
                                        onChange={() => toggleNotification('app')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Notification Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                    <h3 className="font-medium text-red-800 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                        Danger Zone
                    </h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-red-50 rounded-lg">
                            <div className="mb-3 md:mb-0">
                                <h4 className="font-medium text-red-800">Delete Account</h4>
                                <p className="text-sm text-red-600">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={confirmAccountDeletion}
                                className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-white transition-colors whitespace-nowrap"
                            >
                                <Trash2 className="inline mr-2 h-4 w-4" />
                                Delete Account
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-red-50 rounded-lg">
                            <div className="mb-3 md:mb-0">
                                <h4 className="font-medium text-red-800">Cancel Membership</h4>
                                <p className="text-sm text-red-600">
                                    Cancel your premium membership. You'll lose access to premium features immediately.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={confirmMembershipCancellation}
                                className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-white transition-colors whitespace-nowrap"
                            >
                                Cancel Membership
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSection;