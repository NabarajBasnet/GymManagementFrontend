"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const faqs = [
        {
            question: "What is Fitbinary and how does it help gym businesses?",
            answer: "Fitbinary is a comprehensive gym management software that helps fitness businesses streamline operations, manage members, handle payments, track attendance, generate receipts, invoice, and more. Our platform is designed to reduce administrative burden so you can focus on growing your business and serving your members."
        },
        {
            question: "Is Fitbinary suitable for my small gym?",
            answer: "Absolutely! Fitbinary is designed to scale with businesses of all sizes. Our Starter plan is perfect for small gyms, while our more advanced plans offer additional features for larger facilities. The platform grows with your business."
        },
        {
            question: "How long does it take to set up Fitbinary?",
            answer: "Most customers are up and running with Fitbinary in just a few days. Our onboarding team will guide you through the setup process, help you import your existing data, and provide training for you and your staff to ensure a smooth transition."
        },
        {
            question: "Can I migrate my existing member data to Fitbinary?",
            answer: "Yes! We offer data migration services to help you transition from your current system to Fitbinary. Our team will work with you to ensure all your member information, payment records, and other important data are properly transferred."
        },
        {
            question: "How secure is payment processing with Fitbinary?",
            answer: "Fitbinary uses industry-leading encryption and security protocols to protect sensitive data. We're PCI-DSS compliant and partner with trusted payment processors to ensure that all transactions are secure and protected."
        },
        {
            question: "Can I cancel my subscription at any time?",
            answer: "Yes, there are no long-term contracts. You can cancel your subscription at any time, although we require a 30-day notice for cancellation. We're confident you'll love our service, but we don't believe in locking customers into lengthy contracts."
        }
    ];

    return (
        <section id="faq" className="w-full min-h-screen bg-gray-900/40 relative flex items-center py-24">
            {/* Glowing Background Effects - Matching Contact Section */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-40 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 right-20 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-20 right-1/4 w-64 h-64 bg-white/15 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-4xl mx-auto mb-20"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Questions</span>
                    </motion.h2>
                    <motion.p
                        className="text-md text-gray-400 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Find answers to commonly asked questions about Fitbinary.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-6xl mx-auto"
                >
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800"
                    >
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                            >
                                <AccordionItem
                                    value={`item-${index}`}
                                    className="border-b border-gray-800 last:border-b-0 px-6"
                                >
                                    <AccordionTrigger className="hover:no-underline py-6 text-left">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <span className="text-blue-400 font-medium text-sm">{index + 1}</span>
                                            </div>
                                            <h3 className="font-medium text-lg text-white text-left">
                                                {faq.question}
                                            </h3>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6 text-md text-gray-400 pl-12">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>

                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <p className="text-gray-400 mb-6 text-lg">
                            Still have questions? We're here to help!
                        </p>
                        <motion.a
                            href="#contact"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Contact Our Team
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;