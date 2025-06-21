'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Shield, Users, CreditCard, Database, AlertCircle, Mail, Globe } from 'lucide-react';

const TermsOfService = () => {
    const [expandedSections, setExpandedSections] = useState({});
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const termsData = [
        {
            id: 'acceptance',
            title: 'Acceptance of Terms',
            icon: <FileText className="w-5 h-5" />,
            content: 'By accessing or using GymFlow Pro ("Service", "Platform", or "Software"), you ("User", "You", or "Customer") agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Service.',
            highlight: true
        },
        {
            id: 'eligibility',
            title: 'Eligibility',
            icon: <Users className="w-5 h-5" />,
            content: 'You must be at least 18 years old and legally capable of entering into contracts to use this Service. You affirm that you are using the platform for business purposes related to gym or fitness center operations.'
        },
        {
            id: 'service',
            title: 'Description of Service',
            icon: <Shield className="w-5 h-5" />,
            content: 'GymFlow provides a cloud-based gym management solution which includes: Member management, Attendance tracking (QR-code based), Staff and locker management, Payment tracking and billing, Multi-branch and multi-tenant support, Communication and notifications, Analytics and reporting.'
        },
        {
            id: 'registration',
            title: 'Account Registration',
            icon: <Users className="w-5 h-5" />,
            content: 'You agree to provide accurate, complete, and updated account information. You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account.'
        },
        {
            id: 'payments',
            title: 'Subscription and Payments',
            icon: <CreditCard className="w-5 h-5" />,
            content: 'Some features of our Service require a paid subscription. Pricing and billing terms will be provided on our pricing page or custom agreement. Failure to pay may result in the suspension or termination of your access to the Service.'
        },
        {
            id: 'restrictions',
            title: 'Use Restrictions',
            icon: <AlertCircle className="w-5 h-5" />,
            content: 'You agree not to: Resell, distribute, or exploit the Service without our written permission; Use the Service for any unlawful or unauthorized purpose; Attempt to gain unauthorized access to our systems; Reverse engineer or copy the software\'s source code.',
            warning: true
        },
        {
            id: 'data-ownership',
            title: 'Data Ownership',
            icon: <Database className="w-5 h-5" />,
            content: 'You retain ownership of your gym\'s data (members, attendance, payments, etc.). We will never sell your data. However, you grant us a license to use the data solely to provide and improve the Service.'
        },
        {
            id: 'security',
            title: 'Data Security',
            icon: <Shield className="w-5 h-5" />,
            content: 'We implement reasonable security measures to protect your data, but we cannot guarantee absolute security. You acknowledge the risk and agree not to hold us liable for breaches outside our control.'
        },
        {
            id: 'availability',
            title: 'Service Availability',
            icon: <Shield className="w-5 h-5" />,
            content: 'We strive to ensure uninterrupted access, but we do not guarantee 100% uptime. Maintenance, updates, or technical issues may cause temporary disruptions.'
        },
        {
            id: 'termination',
            title: 'Termination',
            icon: <AlertCircle className="w-5 h-5" />,
            content: 'You may terminate your account at any time. We reserve the right to suspend or terminate your access if you violate these Terms or abuse the Service. Upon termination, your data may be retained for a limited period as per our data retention policy.'
        },
        {
            id: 'changes',
            title: 'Changes to Terms',
            icon: <FileText className="w-5 h-5" />,
            content: 'We may modify these Terms at any time. Changes will be notified via email or in-app notification. Continued use of the Service after changes implies acceptance of the updated Terms.'
        },
        {
            id: 'liability',
            title: 'Limitation of Liability',
            icon: <Shield className="w-5 h-5" />,
            content: 'To the fullest extent permitted by law, GymFlow Pro is not liable for indirect, incidental, or consequential damages arising from your use or inability to use the Service.',
            warning: true
        },
        {
            id: 'law',
            title: 'Governing Law',
            icon: <FileText className="w-5 h-5" />,
            content: 'These Terms shall be governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.'
        }
    ];

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Glowing background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full bg-white opacity-5 blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/2 w-80 h-80 rounded-full bg-white opacity-7 blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 mt-6">
                    {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                    </div> */}
                    <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Please read these terms carefully before using GeoLift. By using our service, you agree to these terms.
                    </p>
                    <div className="mt-6 px-4 py-2 bg-blue-900 border border-blue-700 rounded-lg inline-block">
                        <p className="text-blue-100 font-medium">Effective Date: January 15, 2025</p>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome to GeoLift</h2>
                        <p className="text-blue-100">
                            A comprehensive software-as-a-service (SaaS) platform designed to help gyms manage their operations efficiently.
                        </p>
                    </div>
                </div>

                {/* Terms Sections */}
                <div className="space-y-4">
                    {termsData.map((section, index) => (
                        <div
                            key={section.id}
                            className={`bg-gray-900 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl ${section.highlight ? 'border-blue-800 bg-gradient-to-r from-blue-900/50 to-indigo-900/50' :
                                section.warning ? 'border-amber-800 bg-gradient-to-r from-amber-900/50 to-orange-900/50' : 'border-gray-800'
                                }`}
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors duration-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${section.highlight ? 'bg-blue-900 text-blue-400' :
                                        section.warning ? 'bg-amber-900 text-amber-400' : 'bg-gray-800 text-gray-400'
                                        }`}>
                                        {section.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {index + 1}. {section.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="text-gray-500">
                                    {expandedSections[section.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </button>

                            {expandedSections[section.id] && (
                                <div className="px-8 pb-6">
                                    <div className="border-t border-gray-800 pt-6">
                                        <p className="text-gray-300 leading-relaxed text-lg">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Contact Us</h2>
                        <p className="text-gray-300">
                            For any questions or support regarding these terms
                        </p>
                    </div>
                    <div className="px-8 py-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-900/50 rounded-lg">
                                    <Mail className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Email Support</p>
                                    <p className="text-gray-400">support@geolift.com</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-900/50 rounded-lg">
                                    <Globe className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Website</p>
                                    <p className="text-gray-400">www.geolift.com.np</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acceptance Checkbox */}
                <div className="mt-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                    <div className="flex items-start space-x-4">
                        <input
                            type="checkbox"
                            id="accept-terms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-1 w-5 h-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                        />
                        <label htmlFor="accept-terms" className="text-gray-300 text-lg leading-relaxed">
                            I have read and agree to the Terms of Service. I understand that by using GeoLift,
                            I am bound by these terms and conditions.
                        </label>
                    </div>
                    <button
                        disabled={!acceptedTerms}
                        className={`mt-6 w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${acceptedTerms
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {acceptedTerms ? 'Terms Accepted ✓' : 'Please Accept Terms to Continue'}
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-gray-500">
                    <p>© 2025 GeoLift. All rights reserved.</p>
                    <p className="mt-2">Last updated: January 15, 2025</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;