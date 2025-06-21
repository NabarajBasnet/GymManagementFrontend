'use client';

import React from 'react';
import { Mail, Globe, Shield, FileText, CreditCard, Database, User, Calendar, BarChart2 } from 'lucide-react';

const PrivacyPolicy = () => {
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
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                    <div className="flex justify-center gap-4 mt-6">
                        <div className="px-4 py-2 bg-blue-900 border border-blue-700 rounded-lg">
                            <p className="text-blue-100 font-medium">Effective Date: Jan 15 2025</p>
                        </div>
                        <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                            <p className="text-gray-300 font-medium">Last Updated: 21 Jun 2025</p>
                        </div>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 mb-8 p-8">
                    <p className="text-gray-300 text-lg leading-relaxed">
                        At <span className="font-semibold text-white">GeoLift</span> ("we", "our", or "us"), your privacy is very important to us. This Privacy Policy explains how we collect, use, store, and protect personal information when you use our gym management software platform ("Service").
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {/* Section 1 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Database className="w-6 h-6" />
                            </span>
                            1. Information We Collect
                        </h2>
                        <p className="text-gray-300 mb-4 text-lg">We collect the following types of information:</p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-3">a. Account & Business Information</h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                                    <li>Gym/business name, owner name</li>
                                    <li>Email address, phone number</li>
                                    <li>Billing and payment information</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-white mb-3">b. User & Member Data</h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                                    <li>Member names, contact details, date of birth</li>
                                    <li>Attendance records</li>
                                    <li>Subscription/payment history</li>
                                    <li>Staff and trainer profiles</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-white mb-3">c. Technical Information</h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                                    <li>IP address</li>
                                    <li>Browser/device information</li>
                                    <li>Usage data (pages viewed, features used, etc.)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <BarChart2 className="w-6 h-6" />
                            </span>
                            2. How We Use Your Information
                        </h2>
                        <p className="text-gray-300 mb-4 text-lg">We use your data for the following purposes:</p>

                        <ul className="list-disc pl-6 space-y-2 text-gray-300">
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
                    </div>

                    {/* Section 3 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <User className="w-6 h-6" />
                            </span>
                            3. Data Sharing
                        </h2>
                        <p className="text-gray-300 mb-4 text-lg">We may share your data with:</p>

                        <ul className="list-disc pl-6 space-y-2 text-gray-300">
                            <li>Payment processors (for secure transactions)</li>
                            <li>Cloud infrastructure providers (for hosting and backups)</li>
                            <li>Third-party tools strictly used to improve our services (e.g., analytics, emails)</li>
                        </ul>

                        <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                            <p className="text-gray-300">All third parties are obligated to handle your data securely and in accordance with this Privacy Policy.</p>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Calendar className="w-6 h-6" />
                            </span>
                            4. Data Retention
                        </h2>
                        <p className="text-gray-300 text-lg">
                            We retain your data as long as your account is active or as necessary to comply with legal obligations. Upon termination, data may be deleted or retained for a limited period (e.g., 30–90 days), unless required by law.
                        </p>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Shield className="w-6 h-6" />
                            </span>
                            5. Your Rights
                        </h2>
                        <p className="text-gray-300 mb-4 text-lg">You have the right to:</p>

                        <ul className="list-disc pl-6 space-y-2 text-gray-300">
                            <li>Access the data we store about you</li>
                            <li>Request correction or deletion of your data</li>
                            <li>Withdraw consent or delete your account</li>
                            <li>Export your data (upon request)</li>
                        </ul>

                        <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                            <p className="text-gray-300">To exercise any of these rights, contact us at <span className="text-blue-400">support@geolift.com</span>.</p>
                        </div>
                    </div>

                    {/* Section 6 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Shield className="w-6 h-6" />
                            </span>
                            6. Data Security
                        </h2>
                        <p className="text-gray-300 mb-4 text-lg">We use industry-standard security measures including:</p>

                        <ul className="list-disc pl-6 space-y-2 text-gray-300">
                            <li>HTTPS encryption</li>
                            <li>Password hashing</li>
                            <li>Access controls and monitoring</li>
                        </ul>

                        <div className="mt-4 p-4 bg-amber-900/20 border border-amber-800 rounded-lg">
                            <p className="text-amber-200">However, no system is 100% secure. You are responsible for safeguarding your login credentials.</p>
                        </div>
                    </div>

                    {/* Section 7 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Shield className="w-6 h-6" />
                            </span>
                            7. Cookies and Tracking
                        </h2>
                        <p className="text-gray-300 mb-4 text-lg">We may use cookies and tracking technologies to:</p>

                        <ul className="list-disc pl-6 space-y-2 text-gray-300">
                            <li>Maintain session state</li>
                            <li>Analyze usage patterns</li>
                            <li>Improve features</li>
                        </ul>

                        <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                            <p className="text-gray-300">You can manage cookie settings through your browser.</p>
                        </div>
                    </div>

                    {/* Section 8 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <User className="w-6 h-6" />
                            </span>
                            8. Children's Privacy
                        </h2>
                        <p className="text-gray-300 text-lg">
                            Our service is intended for businesses, not children under 13. We do not knowingly collect personal information from minors.
                        </p>
                    </div>

                    {/* Section 9 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Globe className="w-6 h-6" />
                            </span>
                            9. International Users
                        </h2>
                        <p className="text-gray-300 text-lg">
                            If you access our Service from outside [Your Country], your data may be transferred to and processed in [Your Country] or other countries with different data protection laws.
                        </p>
                    </div>

                    {/* Section 10 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <FileText className="w-6 h-6" />
                            </span>
                            10. Changes to This Policy
                        </h2>
                        <p className="text-gray-300 text-lg">
                            We may update this Privacy Policy periodically. You will be notified via email or in-app alert. Continued use of the Service means you agree to the revised terms.
                        </p>
                    </div>

                    {/* Section 11 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Mail className="w-6 h-6" />
                            </span>
                            11. Contact Us
                        </h2>
                        <p className="text-gray-300 mb-6 text-lg">
                            If you have any questions or concerns regarding this Privacy Policy, contact us at:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-900/50 rounded-lg">
                                    <Mail className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Email</p>
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

                {/* Footer */}
                <div className="mt-12 text-center text-gray-500">
                    <p>© 2025 GeoLift. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;