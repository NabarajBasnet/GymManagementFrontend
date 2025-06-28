'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
            content: 'By accessing or using GeoLift ("Service", "Platform", or "Software"), you ("User", "You", or "Customer") agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Service.',
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
            content: 'GeoLift provides a cloud-based gym management solution which includes: Member management, Attendance tracking (QR-code based), Staff and locker management, Payment tracking and billing, Multi-branch and multi-tenant support, Communication and notifications, Analytics and reporting.'
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
            content: 'To the fullest extent permitted by law, GeoLift is not liable for indirect, incidental, or consequential damages arising from your use or inability to use the Service.',
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
        <div className="min-h-screen bg-gray-950 relative overflow-hidden">
            {/* Enhanced Glowing Background */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl animate-float1"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-float2"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl animate-float3"></div>
            </div>

            <style jsx>{`
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-20px, -20px); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(20px, 20px); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(-50%, -50%); }
                    50% { transform: translate(-55%, -45%); }
                }
                .animate-float1 { animation: float1 12s ease-in-out infinite; }
                .animate-float2 { animation: float2 15s ease-in-out infinite; }
                .animate-float3 { animation: float3 18s ease-in-out infinite; }
            `}</style>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
                        Last updated: January 15, 2025 | Effective immediately
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <div className="px-5 py-2.5 bg-blue-900/50 border border-blue-700 rounded-lg backdrop-blur-sm">
                            <p className="text-blue-100 font-medium">For Business Use Only</p>
                        </div>
                        <div className="px-5 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-sm">
                            <p className="text-gray-300 font-medium">Legally Binding Agreement</p>
                        </div>
                    </div>
                </motion.div>

                {/* Introduction Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 mb-12 p-8"
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0 p-3 bg-blue-900/20 rounded-lg mr-4">
                            <AlertCircle className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">Important Legal Notice</h2>
                            <p className="text-gray-300 leading-relaxed">
                                These Terms of Service ("Terms") govern your access to and use of the GeoLift platform. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these terms, you may not use our services.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Terms Sections */}
                <div className="space-y-4">
                    {termsData.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className={`bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden transition-all duration-300 hover:shadow-lg ${section.highlight ? 'border-blue-500/30' : section.warning ? 'border-amber-500/30' : 'border-white/10'}`}
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className={`w-full px-6 py-5 text-left flex items-center justify-between transition-colors duration-200 ${expandedSections[section.id] ? 'bg-white/5' : 'hover:bg-white/5'}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2.5 rounded-lg ${section.highlight ? 'bg-blue-900/50 text-blue-400' :
                                        section.warning ? 'bg-amber-900/50 text-amber-400' : 'bg-gray-800/50 text-gray-400'
                                        }`}>
                                        {section.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-semibold text-white">
                                            {index + 1}. {section.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="text-gray-500 ml-4">
                                    {expandedSections[section.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </button>

                            {expandedSections[section.id] && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-6 pb-6"
                                >
                                    <div className="border-t border-white/10 pt-6">
                                        <p className="text-gray-300 leading-relaxed">
                                            {section.content}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Acceptance Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-8"
                >
                    <h3 className="text-2xl font-bold text-white mb-6">Acceptance of Terms</h3>

                    <div className="flex items-start space-x-4 mb-6">
                        <input
                            type="checkbox"
                            id="accept-terms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-1 flex-shrink-0 w-5 h-5 text-blue-600 border-gray-500 rounded focus:ring-blue-500 bg-gray-800/50"
                        />
                        <label htmlFor="accept-terms" className="text-gray-300 text-lg leading-relaxed">
                            I acknowledge that I have read, understood, and agree to be bound by these Terms of Service. I understand that these terms constitute a legally binding agreement between me and GeoLift.
                        </label>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!acceptedTerms}
                        className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${acceptedTerms
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-blue-500/20 shadow-lg'
                            : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700'
                            }`}
                    >
                        {acceptedTerms ? 'Continue to Service' : 'Accept Terms to Continue'}
                    </motion.button>
                </motion.div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Need Help?</h2>
                        <p className="text-gray-300">
                            Contact our support team for any questions about these terms
                        </p>
                    </div>
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                                <div className="p-3 bg-blue-900/50 rounded-lg">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Email Support</p>
                                    <p className="text-gray-400">support@geolift.com</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                                <div className="p-3 bg-green-900/50 rounded-lg">
                                    <Globe className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Website</p>
                                    <p className="text-gray-400">www.geolift.com.np</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center text-gray-500 border-t border-gray-800/50 pt-8"
                >
                    <p>© {new Date().getFullYear()} GeoLift Technologies. All rights reserved.</p>
                    <p className="mt-2 text-sm">Version 2.1.0 | Effective January 15, 2025</p>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;