"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Mail, Check } from 'lucide-react';

const DemoSection = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, name, company });
        setSubmitted(true);
    };

    return (
        <section id="demo" className="py-28 relative overflow-hidden bg-gray-950">
            {/* White Glowing Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full filter blur-[100px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.div
                    className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[100px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                    {/* Left side */}
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, x: -80 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold text-white mb-8"
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Ready to Transform Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Gym Management</span>?
                        </motion.h2>
                        <motion.p
                            className="text-xl text-gray-400 mb-10"
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Request a personalized demo and see how FitLoft can help streamline your operations,
                            boost member engagement, and grow your fitness business.
                        </motion.p>

                        <motion.div
                            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-xl p-8 mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-start gap-6 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <span className="text-blue-400 font-bold text-lg">1</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg mb-1">Schedule a Demo</h3>
                                    <p className="text-gray-400">Fill out the form to book your personalized demo</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <span className="text-blue-400 font-bold text-lg">2</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg mb-1">Explore Features</h3>
                                    <p className="text-gray-400">See how FitLoft can address your specific needs</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <span className="text-blue-400 font-bold text-lg">3</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg mb-1">Get Started</h3>
                                    <p className="text-gray-400">Launch with our team's full support</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-6"
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="flex-shrink-0">
                                <img
                                    src="https://images.pexels.com/photos/8851691/pexels-photo-8851691.jpeg?auto=compress&cs=tinysrgb&w=150"
                                    alt="Customer"
                                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                                />
                            </div>
                            <div>
                                <p className="text-gray-400 italic mb-2">
                                    "FlexGym has transformed how we manage our gym. The interface is intuitive, and the support is exceptional."
                                </p>
                                <p className="text-white font-medium">Sarah Johnson</p>
                                <p className="text-sm text-gray-500">Fitness Center Owner</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right side - Demo Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-xl p-8">
                            {!submitted ? (
                                <>
                                    <h3 className="text-2xl font-bold text-white mb-8">Request Your Demo</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Work Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Company / Gym Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                                                placeholder="Fitness Center"
                                            />
                                        </div>

                                        <motion.button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-medium shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Schedule Demo <ArrowRight size={18} />
                                        </motion.button>
                                    </form>

                                    <p className="text-xs text-gray-500 mt-6 text-center">
                                        By submitting this form, you agree to our Privacy Policy and Terms of Service.
                                    </p>
                                </>
                            ) : (
                                <motion.div
                                    className="text-center py-8"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="w-16 h-16 bg-green-900/20 border border-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check size={24} className="text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
                                    <p className="text-gray-400 mb-6">
                                        We've received your demo request and will contact you shortly at <span className="text-blue-400">{email}</span>.
                                    </p>
                                    <motion.button
                                        onClick={() => setSubmitted(false)}
                                        className="text-blue-400 font-medium hover:underline"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Submit another request
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DemoSection;
