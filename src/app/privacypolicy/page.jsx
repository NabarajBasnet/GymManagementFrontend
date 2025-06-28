'use client';

import React from 'react';
import { Mail, Globe, Shield, FileText, CreditCard, Database, User, Calendar, BarChart2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    const sections = [
        {
            id: 'info-collection',
            icon: <Database className="w-5 h-5" />,
            title: "Information We Collect",
            content: (
                <>
                    <p className="text-gray-300 mb-4">We collect the following types of information:</p>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Account & Business Information</h3>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                                <li>Gym/business name, owner name</li>
                                <li>Email address, phone number</li>
                                <li>Billing and payment information</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">User & Member Data</h3>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                                <li>Member names, contact details, date of birth</li>
                                <li>Attendance records</li>
                                <li>Subscription/payment history</li>
                                <li>Staff and trainer profiles</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Technical Information</h3>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                                <li>IP address</li>
                                <li>Browser/device information</li>
                                <li>Usage data (pages viewed, features used, etc.)</li>
                            </ul>
                        </div>
                    </div>
                </>
            )
        },
        {
            id: 'data-usage',
            icon: <BarChart2 className="w-5 h-5" />,
            title: "How We Use Your Information",
            content: (
                <>
                    <p className="text-gray-300 mb-4">We use your data for the following purposes:</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                        <li>To create and manage your account</li>
                        <li>To provide and improve our services</li>
                        <li>To send system alerts, invoices, and important notices</li>
                        <li>To provide technical support</li>
                        <li>To analyze usage and improve product performance</li>
                        <li>To detect and prevent fraud or security issues</li>
                    </ul>
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                        <p className="text-blue-200 font-medium">We do not sell or rent your data to third parties.</p>
                    </div>
                </>
            )
        },
        {
            id: 'data-sharing',
            icon: <User className="w-5 h-5" />,
            title: "Data Sharing",
            content: (
                <>
                    <p className="text-gray-300 mb-4">We may share your data with:</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                        <li>Payment processors (for secure transactions)</li>
                        <li>Cloud infrastructure providers (for hosting and backups)</li>
                        <li>Third-party tools strictly used to improve our services (e.g., analytics, emails)</li>
                    </ul>
                    <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <p className="text-gray-300">All third parties are obligated to handle your data securely and in accordance with this Privacy Policy.</p>
                    </div>
                </>
            )
        },
        {
            id: 'data-retention',
            icon: <Calendar className="w-5 h-5" />,
            title: "Data Retention",
            content: (
                <p className="text-gray-300">
                    We retain your data as long as your account is active or as necessary to comply with legal obligations. Upon termination, data may be deleted or retained for a limited period (e.g., 30–90 days), unless required by law.
                </p>
            )
        },
        {
            id: 'user-rights',
            icon: <Shield className="w-5 h-5" />,
            title: "Your Rights",
            content: (
                <>
                    <p className="text-gray-300 mb-4">You have the right to:</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                        <li>Access the data we store about you</li>
                        <li>Request correction or deletion of your data</li>
                        <li>Withdraw consent or delete your account</li>
                        <li>Export your data (upon request)</li>
                    </ul>
                    <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <p className="text-gray-300">To exercise any of these rights, contact us at <span className="text-blue-400">support@geolift.com</span>.</p>
                    </div>
                </>
            )
        },
        {
            id: 'data-security',
            icon: <Shield className="w-5 h-5" />,
            title: "Data Security",
            content: (
                <>
                    <p className="text-gray-300 mb-4">We use industry-standard security measures including:</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                        <li>HTTPS encryption</li>
                        <li>Password hashing</li>
                        <li>Access controls and monitoring</li>
                    </ul>
                    <div className="mt-4 p-4 bg-amber-900/20 border border-amber-800 rounded-lg">
                        <p className="text-amber-200">However, no system is 100% secure. You are responsible for safeguarding your login credentials.</p>
                    </div>
                </>
            )
        },
        {
            id: 'contact',
            icon: <Mail className="w-5 h-5" />,
            title: "Contact Us",
            content: (
                <>
                    <p className="text-gray-300 mb-6">If you have any questions or concerns regarding this Privacy Policy, contact us at:</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                            <div className="p-2 bg-blue-900/50 rounded-lg">
                                <Mail className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Email</p>
                                <p className="text-gray-400">support@geolift.com</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                            <div className="p-2 bg-green-900/50 rounded-lg">
                                <Globe className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Website</p>
                                <p className="text-gray-400">www.geolift.com.np</p>
                            </div>
                        </div>
                    </div>
                </>
            )
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
                {/* Header with Floating Animation */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
                        At <span className="font-semibold text-white">GeoLift</span>, we are committed to protecting your privacy and personal information.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <div className="px-5 py-2.5 bg-blue-900/50 border border-blue-700 rounded-lg backdrop-blur-sm">
                            <p className="text-blue-100 font-medium">Effective: Jan 15, 2025</p>
                        </div>
                        <div className="px-5 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-sm">
                            <p className="text-gray-300 font-medium">Last Updated: Jun 21, 2025</p>
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
                    <p className="text-gray-300 leading-relaxed">
                        This Privacy Policy explains how <span className="font-semibold text-white">GeoLift</span> ("we", "our", or "us") collects, uses, stores, and protects personal information when you use our gym management software platform ("Service"). By using our Service, you agree to the collection and use of information in accordance with this policy.
                    </p>
                </motion.div>

                {/* Table of Contents (Sticky on Scroll) */}
                <div className="sticky top-4 mb-8 z-20">
                    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-4 shadow-lg">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <ChevronDown className="w-5 h-5 mr-2 text-blue-400" />
                            Table of Contents
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {sections.map((section, index) => (
                                <a 
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded transition-colors"
                                >
                                    {index + 1}. {section.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Policy Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            id={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex items-center mb-6">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center mr-4">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {index + 1}. {section.title}
                                    </h2>
                                </div>
                                <div className="pl-14">
                                    {section.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center text-gray-500 border-t border-gray-800/50 pt-8"
                >
                    <p>© {new Date().getFullYear()} GeoLift Technologies. All rights reserved.</p>
                    <p className="mt-2 text-sm">Version 2.1.0</p>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;