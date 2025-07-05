'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Users, Clock, Database, CreditCard, X } from 'lucide-react';

const faqs = [
    {
        question: "What is Fitbinary and how does it help gym businesses?",
        answer: "Fitbinary is a comprehensive gym management software that helps fitness businesses streamline operations, manage members, handle payments, track attendance, generate receipts, invoice, and more. Our platform is designed to reduce administrative burden so you can focus on growing your business and serving your members.",
        icon: HelpCircle,
        category: "General"
    },
    {
        question: "Is Fitbinary suitable for my small gym?",
        answer: "Absolutely! Fitbinary is designed to scale with businesses of all sizes. Our Starter plan is perfect for small gyms, while our more advanced plans offer additional features for larger facilities. The platform grows with your business.",
        icon: Users,
        category: "Business"
    },
    {
        question: "How long does it take to set up Fitbinary?",
        answer: "Most customers are up and running with Fitbinary in just a few days. Our onboarding team will guide you through the setup process, help you import your existing data, and provide training for you and your staff to ensure a smooth transition.",
        icon: Clock,
        category: "Setup"
    },
    {
        question: "Can I migrate my existing member data to Fitbinary?",
        answer: "Yes! We offer data migration services to help you transition from your current system to Fitbinary. Our team will work with you to ensure all your member information, payment records, and other important data are properly transferred.",
        icon: Database,
        category: "Migration"
    },
    {
        question: "How secure is payment processing with Fitbinary?",
        answer: "Fitbinary uses industry-leading encryption and security protocols to protect sensitive data. We're PCI-DSS compliant and partner with trusted payment processors to ensure that all transactions are secure and protected.",
        icon: Shield,
        category: "Security"
    },
    {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, there are no long-term contracts. You can cancel your subscription at any time, although we require a 30-day notice for cancellation. We're confident you'll love our service, but we don't believe in locking customers into lengthy contracts.",
        icon: CreditCard,
        category: "Billing"
    }
];

const FAQItem = ({ faq, index, isOpen, onToggle }) => {
    const IconComponent = faq.icon;

    return (
        <div className="group">
            <div
                className={`
                    relative bg-white/5 dark:bg-white/5 backdrop-blur-xl 
                    border border-white/10 dark:border-white/10 rounded-2xl 
                    overflow-hidden transition-all duration-300 ease-out
                    hover:bg-white/10 hover:border-white/20 
                    hover:shadow-xl hover:shadow-blue-500/10
                    ${isOpen ? 'bg-white/10 border-white/20 shadow-xl shadow-blue-500/10' : ''}
                `}
            >
                {/* Animated background gradient */}
                <div className={`
                    absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 
                    transition-opacity duration-300 
                    ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                `} />

                <button
                    onClick={onToggle}
                    className="relative w-full px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`
                                flex items-center justify-center w-10 h-10 rounded-xl
                                bg-gradient-to-br from-blue-500/20 to-cyan-500/20
                                transition-all duration-300
                                ${isOpen ? 'scale-110 from-blue-500/30 to-cyan-500/30' : 'group-hover:scale-105'}
                            `}>
                                <IconComponent className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <span className="text-sm font-medium text-blue-400/70 mb-1 block">
                                    {faq.category}
                                </span>
                                <h3 className="text-lg font-semibold text-white pr-8">
                                    {faq.question}
                                </h3>
                            </div>
                        </div>
                        <div className={`
                            flex items-center justify-center w-8 h-8 rounded-lg
                            bg-white/5 transition-all duration-300
                            ${isOpen ? 'rotate-180 bg-blue-500/20' : 'group-hover:bg-white/10'}
                        `}>
                            <ChevronDown className="w-4 h-4 text-white/60" />
                        </div>
                    </div>
                </button>

                <div className={`
                    overflow-hidden transition-all duration-300 ease-out
                    ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    <div className="px-6 pb-6 pt-0">
                        <div className="pl-14">
                            <div className="h-px bg-gradient-to-r from-white/10 to-transparent mb-4" />
                            <p className="text-white/70 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="relative w-full min-h-screen bg-gray-950 overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 z-0">
                {/* Primary glowing orbs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-blue-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Secondary accent orbs */}
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
                <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-teal-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

                {/* Animated mesh gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />

                {/* Subtle noise texture */}
                <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40`} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24 lg:px-10">
                <div className="w-full max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                            <HelpCircle className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-blue-400 text-sm font-medium">Frequently Asked Questions</span>
                        </div>

                        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                                Got Questions?
                            </span>
                        </h2>

                        <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                            Everything you need to know about Fitbinary. Can't find what you're looking for?
                        </p>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4 mb-16">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                faq={faq}
                                index={index}
                                isOpen={openIndex === index}
                                onToggle={() => toggleFAQ(index)}
                            />
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Still have questions?
                                </h3>
                                <p className="text-white/60 mb-6 max-w-md">
                                    Our team is here to help you get started with Fitbinary
                                </p>
                                <a
                                    href="#contact"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                                >
                                    <span>Contact our team</span>
                                    <ChevronDown className="w-5 h-5 ml-2 rotate-[-90deg]" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;