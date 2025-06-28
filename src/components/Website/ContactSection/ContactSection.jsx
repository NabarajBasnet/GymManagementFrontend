"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react';

const ContactSection = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email, message });
        setSubmitted(true);

        setTimeout(() => {
            setName('');
            setEmail('');
            setMessage('');
            setSubmitted(false);
        }, 3000);
    };

    return (
        <section id="contact" className="py-28 relative bg-gray-900/40 min-h-[80vh]">
            {/* Glowing Background Effects - Matching Hero Section */}
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
                        Get In <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Touch</span>
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-300 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Have questions or need assistance? We're here to help you get the most out of GeoFit.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left Side - Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -80 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-8">Send Us a Message</h3>

                            {submitted ? (
                                <motion.div
                                    className="bg-green-900/20 border border-green-800 rounded-xl p-6 text-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Send className="h-10 w-10 text-green-400 mx-auto mb-4" />
                                    <p className="text-green-300 font-medium text-lg">
                                        Thanks for reaching out! We'll get back to you soon.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Send Message
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Side - Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        className="space-y-8"
                    >
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>

                            <div className="space-y-6">
                                <motion.div
                                    className="flex items-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <div className="p-3 bg-blue-500/10 rounded-lg mr-4">
                                        <Mail className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Email</p>
                                        <a href="mailto:info@geofit.com" className="text-lg font-medium text-white hover:text-blue-400 transition-colors">
                                            info@geofit.com
                                        </a>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <div className="p-3 bg-blue-500/10 rounded-lg mr-4">
                                        <Phone className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Phone</p>
                                        <a href="tel:+9779763427690" className="text-lg font-medium text-white hover:text-blue-400 transition-colors">
                                            +977 976-3427690
                                        </a>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <div className="p-3 bg-blue-500/10 rounded-lg mr-4">
                                        <MapPin className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Office</p>
                                        <p className="text-lg font-medium text-white">
                                            Baneshwor Height 10<br />
                                            Bagmati, Kathmandu, NP 44600
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Customer Support Hours</h3>

                            <div className="space-y-4">
                                <motion.div
                                    className="flex items-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <div className="p-3 bg-blue-500/10 rounded-lg mr-4">
                                        <Clock className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1 flex justify-between items-center">
                                        <span className="text-gray-300">Monday - Friday:</span>
                                        <span className="font-medium text-white">8:00 AM - 8:00 PM EST</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                    transition={{ delay: 1.0 }}
                                >
                                    <div className="p-3 bg-blue-500/10 rounded-lg mr-4 opacity-0">
                                        <Clock className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1 flex justify-between items-center">
                                        <span className="text-gray-300">Saturday:</span>
                                        <span className="font-medium text-white">10:00 AM - 6:00 PM EST</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                    transition={{ delay: 1.1 }}
                                >
                                    <div className="p-3 bg-blue-500/10 rounded-lg mr-4 opacity-0">
                                        <Clock className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1 flex justify-between items-center">
                                        <span className="text-gray-300">Sunday:</span>
                                        <span className="font-medium text-white">Closed</span>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                className="mt-8 pt-6 border-t border-white/10"
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ delay: 1.2 }}
                            >
                                <p className="text-gray-300">
                                    For urgent matters outside of business hours, please email{' '}
                                    <a href="mailto:support@geofit.com" className="text-blue-400 font-medium hover:underline">
                                        support@geofit.com
                                    </a>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;