'use client';

import { ChevronDown, ChevronUp, FileText, Shield, Users, CreditCard, Database, AlertCircle, Mail, Globe } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, List, Check, X } from 'lucide-react';

const CookiesPolicy = () => {
    const [showBanner, setShowBanner] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});
    const [cookiePreferences, setCookiePreferences] = useState({
        necessary: true,
        analytics: false,
        marketing: false
    });

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handlePreferenceChange = (type) => {
        if (type === 'necessary') return; // Necessary cookies can't be disabled
        setCookiePreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const savePreferences = () => {
        // In a real implementation, you would save these preferences
        console.log('Cookie preferences saved:', cookiePreferences);
        setShowBanner(false);
    };

    const acceptAll = () => {
        setCookiePreferences({
            necessary: true,
            analytics: true,
            marketing: true
        });
        setShowBanner(false);
    };

    const sections = [
        {
            id: 'what-are-cookies',
            title: 'What Are Cookies?',
            icon: <Cookie className="w-5 h-5" />,
            content: 'Cookies are small text files stored on your device when you visit websites. They help websites remember information about your visit, which can make it easier to visit the site again and make the site more useful to you.'
        },
        {
            id: 'how-we-use',
            title: 'How We Use Cookies',
            icon: <Settings className="w-5 h-5" />,
            content: 'We use cookies to enhance your experience on our platform, analyze site usage, and assist in our marketing efforts. Cookies help us understand how our services are being used, improve site functionality, and personalize content.'
        },
        {
            id: 'types-of-cookies',
            title: 'Types of Cookies We Use',
            icon: <List className="w-5 h-5" />,
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-white mb-2 flex items-center">
                            <Check className="w-5 h-5 text-green-400 mr-2" />
                            Necessary Cookies
                        </h4>
                        <p className="text-gray-300">
                            Essential for the website to function properly. These cookies enable core functionality like security, network management, and accessibility.
                        </p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-white mb-2">Analytics Cookies</h4>
                        <p className="text-gray-300">
                            Help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the user experience.
                        </p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-white mb-2">Marketing Cookies</h4>
                        <p className="text-gray-300">
                            Used to track visitors across websites to display relevant ads. These cookies may be set by third-party providers whose services we've added to our pages.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'managing-cookies',
            title: 'Managing Cookies',
            icon: <Shield className="w-5 h-5" />,
            content: 'You can control and/or delete cookies as you wish. Most browsers allow you to refuse cookies or delete them. You can typically find these settings in the "Options" or "Preferences" menu of your browser. However, disabling essential cookies may affect the functionality of our website.'
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

            {/* Cookies Banner */}
            {showBanner && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed bottom-0 left-0 right-0 z-50"
                >
                    <div className="bg-gray-900 border-t border-gray-800 shadow-xl">
                        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">We Value Your Privacy</h3>
                                    <p className="text-gray-300">
                                        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By continuing to use our site, you consent to our use of cookies.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={savePreferences}
                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                    >
                                        Save Preferences
                                    </button>
                                    <button
                                        onClick={acceptAll}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-colors"
                                    >
                                        Accept All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <Cookie className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Cookies Policy
                    </h1>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Last updated: January 15, 2025 | Effective immediately
                    </p>
                </motion.div>

                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 mb-12 p-8"
                >
                    <p className="text-gray-300 leading-relaxed">
                        This Cookies Policy explains what cookies are, how we use them, the types of cookies we use, and how you can manage your cookie preferences. By using our website, you consent to the use of cookies in accordance with this policy.
                    </p>
                </motion.div>

                {/* Cookie Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 mb-12 p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Settings className="w-6 h-6 text-blue-400 mr-3" />
                        Your Cookie Preferences
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div>
                                <h3 className="font-semibold text-white flex items-center">
                                    <Check className="w-5 h-5 text-green-400 mr-2" />
                                    Necessary Cookies
                                </h3>
                                <p className="text-gray-300 text-sm mt-1">
                                    Always active. Essential for the website to function properly.
                                </p>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                <input
                                    type="checkbox"
                                    checked={true}
                                    disabled
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                />
                                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div>
                                <h3 className="font-semibold text-white">Analytics Cookies</h3>
                                <p className="text-gray-300 text-sm mt-1">
                                    Help us understand how visitors interact with our website.
                                </p>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                <input
                                    type="checkbox"
                                    checked={cookiePreferences.analytics}
                                    onChange={() => handlePreferenceChange('analytics')}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                />
                                <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${cookiePreferences.analytics ? 'bg-blue-500' : 'bg-gray-300'}`}></label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div>
                                <h3 className="font-semibold text-white">Marketing Cookies</h3>
                                <p className="text-gray-300 text-sm mt-1">
                                    Used to track visitors across websites for advertising.
                                </p>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                <input
                                    type="checkbox"
                                    checked={cookiePreferences.marketing}
                                    onChange={() => handlePreferenceChange('marketing')}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                />
                                <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${cookiePreferences.marketing ? 'bg-blue-500' : 'bg-gray-300'}`}></label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={savePreferences}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-colors"
                        >
                            Save Preferences
                        </button>
                    </div>
                </motion.div>

                {/* Policy Sections */}
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-2.5 bg-gray-800/50 rounded-lg text-gray-400">
                                        {section.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-semibold text-white">
                                            {section.title}
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
                                        {typeof section.content === 'string' ? (
                                            <p className="text-gray-300 leading-relaxed">
                                                {section.content}
                                            </p>
                                        ) : (
                                            section.content
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Questions About Our Cookies?</h2>
                        <p className="text-gray-300">
                            Contact our team for more information about our cookie usage
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
                                    <p className="text-gray-400">support@fitbinary.com</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                                <div className="p-3 bg-green-900/50 rounded-lg">
                                    <Globe className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Website</p>
                                    <p className="text-gray-400">www.fitbinary.com/privacy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CookiesPolicy;