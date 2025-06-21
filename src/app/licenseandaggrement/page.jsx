'use client';

import React from 'react';
import { FileText, Shield, CreditCard, Database, AlertCircle, Mail, Globe, Lock, Code, Layers } from 'lucide-react';

const LicenseAndAgreement = () => {
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
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">GeoLift License Agreement</h1>
                    <div className="px-4 py-2 bg-blue-900 border border-blue-700 rounded-lg inline-block">
                        <p className="text-blue-100 font-medium">Effective Date: 15 Jan 2025</p>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 mb-8 p-8">
                    <p className="text-gray-300 text-lg leading-relaxed">
                        This Software-as-a-Service (SaaS) License Agreement ("Agreement") is entered into by and between <span className="font-semibold text-white">GeoLift</span>, the provider of the software ("Provider", "we", "us", or "our"), and you, the subscribing entity or individual ("Customer", "you", or "your").
                    </p>
                    <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <p className="text-gray-300">
                            By accessing or using the <span className="font-semibold text-white">GeoLift</span> platform ("Software" or "Service"), you agree to be bound by this Agreement.
                        </p>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {/* Section 1 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Layers className="w-6 h-6" />
                            </span>
                            1. Grant of License
                        </h2>
                        <div className="space-y-4 text-gray-300 text-lg">
                            <p>
                                We grant you a non-exclusive, non-transferable, limited license to use the Software for your internal gym or fitness business operations, subject to the terms of this Agreement.
                            </p>
                            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <p className="text-amber-200">
                                    You may not sublicense, resell, or redistribute the Software without written consent from us.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Shield className="w-6 h-6" />
                            </span>
                            2. Ownership and Intellectual Property
                        </h2>
                        <p className="text-gray-300 text-lg">
                            All rights, title, and interest in and to the Software, including all intellectual property rights, are owned by <span className="font-semibold text-white">[Your Company Name]</span>. No ownership rights are transferred to you under this Agreement.
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <AlertCircle className="w-6 h-6" />
                            </span>
                            3. Restrictions
                        </h2>
                        <p className="text-gray-300 mb-4 text-lg">You agree NOT to:</p>

                        <ul className="list-disc pl-6 space-y-2 text-gray-300">
                            <li>Reverse engineer, modify, or create derivative works of the Software.</li>
                            <li>Remove or obscure any proprietary notices.</li>
                            <li>Use the Software for illegal, harmful, or unauthorized purposes.</li>
                        </ul>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <CreditCard className="w-6 h-6" />
                            </span>
                            4. Fees and Payment
                        </h2>
                        <div className="space-y-4 text-gray-300 text-lg">
                            <p>
                                Access to the Software may require a paid subscription. Pricing, billing cycle, and refund policies are disclosed on our website or via direct agreement.
                            </p>
                            <div className="p-4 bg-amber-900/20 border border-amber-800 rounded-lg">
                                <p className="text-amber-200">
                                    Failure to pay on time may result in suspension or termination of your account.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Shield className="w-6 h-6" />
                            </span>
                            5. Availability and Support
                        </h2>
                        <div className="space-y-4 text-gray-300 text-lg">
                            <p>
                                We aim for high availability of the Software but do not guarantee uninterrupted service. Support may be offered via email or live chat during business hours.
                            </p>
                            <p>
                                Planned downtime or maintenance will be communicated in advance whenever possible.
                            </p>
                        </div>
                    </div>

                    {/* Section 6 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Database className="w-6 h-6" />
                            </span>
                            6. Customer Data
                        </h2>
                        <div className="space-y-4 text-gray-300 text-lg">
                            <p>
                                You retain full ownership of all data you input into the Software ("Customer Data"). We will only access or use this data as necessary to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide and improve the Service</li>
                                <li>Comply with legal obligations</li>
                                <li>Respond to support requests</li>
                            </ul>
                            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                                <p className="text-blue-200 font-medium">
                                    We will not sell your data under any circumstances.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 7 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Lock className="w-6 h-6" />
                            </span>
                            7. Data Security
                        </h2>
                        <div className="space-y-4 text-gray-300 text-lg">
                            <p>
                                We take reasonable technical and organizational measures to protect Customer Data from unauthorized access, loss, or misuse.
                            </p>
                            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <p className="text-gray-300">
                                    However, you acknowledge that no method of transmission over the Internet is completely secure.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 8 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <AlertCircle className="w-6 h-6" />
                            </span>
                            8. Term and Termination
                        </h2>
                        <div className="space-y-4 text-gray-300 text-lg">
                            <p>
                                This Agreement begins on the date you start using the Software and continues until terminated.
                            </p>
                            <p>
                                You may terminate at any time by canceling your subscription. We may suspend or terminate your access if you violate this Agreement or fail to pay.
                            </p>
                            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                                <p className="text-gray-300">
                                    Upon termination, your access will be revoked and your data may be deleted after a retention period (e.g., 30–90 days).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 9 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Shield className="w-6 h-6" />
                            </span>
                            9. Disclaimer of Warranties
                        </h2>
                        <div className="p-4 bg-amber-900/20 border border-amber-800 rounded-lg">
                            <p className="text-amber-200 text-lg">
                                The Software is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to fitness for a particular purpose or non-infringement.
                            </p>
                        </div>
                    </div>

                    {/* Section 10 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <AlertCircle className="w-6 h-6" />
                            </span>
                            10. Limitation of Liability
                        </h2>
                        <div className="p-4 bg-amber-900/20 border border-amber-800 rounded-lg">
                            <p className="text-amber-200 text-lg">
                                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages, including lost profits, arising from your use or inability to use the Software.
                            </p>
                        </div>
                    </div>

                    {/* Section 11 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <FileText className="w-6 h-6" />
                            </span>
                            11. Modifications
                        </h2>
                        <p className="text-gray-300 text-lg">
                            We reserve the right to modify this Agreement at any time. Changes will be posted on our website or notified via email. Continued use of the Software after such updates constitutes acceptance.
                        </p>
                    </div>

                    {/* Section 12 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Globe className="w-6 h-6" />
                            </span>
                            12. Governing Law
                        </h2>
                        <p className="text-gray-300 text-lg">
                            This Agreement shall be governed by and construed in accordance with the laws of <span className="font-semibold text-white">Your Country,</span> without regard to its conflict of laws principles.
                        </p>
                    </div>

                    {/* Section 13 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <FileText className="w-6 h-6" />
                            </span>
                            13. Entire Agreement
                        </h2>
                        <p className="text-gray-300 text-lg">
                            This Agreement, along with our Terms of Service and Privacy Policy, constitutes the entire understanding between you and us and supersedes all prior agreements.
                        </p>
                    </div>

                    {/* Section 14 */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="bg-blue-900 text-blue-400 rounded-lg p-2 mr-4">
                                <Mail className="w-6 h-6" />
                            </span>
                            14. Contact
                        </h2>
                        <p className="text-gray-300 mb-6 text-lg">
                            For questions regarding this Agreement, please contact:
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

export default LicenseAndAgreement;