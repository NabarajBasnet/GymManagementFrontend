"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Mail, Check, Phone, MapPin, Building, MessageCircle, User, AlertCircle } from 'lucide-react';

const DemoSection = () => {
    const [submitted, setSubmitted] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm();

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });


    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://localhost:3000/api/demo/submit-demo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                }, 7000);
            }
            reset();
            setCaptchaToken('');
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    return (
        <section id="demo" className="w-full py-28 relative overflow-hidden bg-gray-950">
            <div className="w-full mx-auto px-4 relative z-10">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto">
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
                            Ready to Transform Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Gym Management</span>?
                        </motion.h2>
                        <motion.p
                            className="text-xl text-gray-300 mb-10"
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Request a personalized demo and see how Fitbinary can help streamline your operations,
                            boost member engagement, and grow your fitness business.
                        </motion.p>

                        <motion.div
                            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl p-8 mb-10"
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
                                    <p className="text-gray-300">Fill out the form to book your personalized demo</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <span className="text-blue-400 font-bold text-lg">2</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg mb-1">Explore Features</h3>
                                    <p className="text-gray-300">See how Fitbinary can address your specific needs</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <span className="text-blue-400 font-bold text-lg">3</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-lg mb-1">Get Started</h3>
                                    <p className="text-gray-300">Launch with our team's full support</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right side - Demo Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl p-8">
                            {!submitted ? (
                                <>
                                    <h3 className="text-2xl font-bold text-white mb-8">Request Your Demo</h3>
                                    <div className="space-y-6">
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <User size={16} className="inline mr-2" />
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                {...register('fullName', {
                                                    required: 'Full name is required',
                                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                                    maxLength: { value: 50, message: 'Name must be less than 50 characters' }
                                                })}
                                                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                                                placeholder="John Doe"
                                            />
                                            {errors.fullName && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.fullName.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <Mail size={16} className="inline mr-2" />
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                {...register('email', {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Please enter a valid email address'
                                                    }
                                                })}
                                                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <Phone size={16} className="inline mr-2" />
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                {...register('phone', {
                                                    required: 'Phone number is required',
                                                    pattern: {
                                                        value: /^[\+]?[1-9][\d]{0,15}$/,
                                                        message: 'Please enter a valid phone number'
                                                    }
                                                })}
                                                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.phone.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Gym Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <Building size={16} className="inline mr-2" />
                                                Gym / Business Name
                                            </label>
                                            <input
                                                type="text"
                                                {...register('gymName', {
                                                    maxLength: { value: 100, message: 'Gym name must be less than 100 characters' }
                                                })}
                                                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                                                placeholder="Fitness Center Pro"
                                            />
                                            {errors.gymName && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.gymName.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <MapPin size={16} className="inline mr-2" />
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                {...register('location')}
                                                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                                                placeholder="City, State/Country"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <MessageCircle size={16} className="inline mr-2" />
                                                Message
                                            </label>
                                            <textarea
                                                {...register('message', {
                                                    maxLength: { value: 500, message: 'Message must be less than 500 characters' }
                                                })}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all resize-none"
                                                placeholder="Tell us about your specific needs or requirements..."
                                            />
                                            {errors.message && (
                                                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {errors.message.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Source */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                How did you hear about us?
                                            </label>
                                            <select
                                                {...register('source')}
                                                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all"
                                            >
                                                <option value="" className="bg-gray-800">Select an option</option>
                                                <option value="google" className="bg-gray-800">Google Search</option>
                                                <option value="social_media" className="bg-gray-800">Social Media</option>
                                                <option value="referral" className="bg-gray-800">Referral</option>
                                                <option value="advertisement" className="bg-gray-800">Advertisement</option>
                                                <option value="other" className="bg-gray-800">Other</option>
                                            </select>
                                        </div>

                                        <motion.button
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Schedule Demo'}
                                            <ArrowRight size={18} />
                                        </motion.button>
                                    </div>

                                    <p className="text-xs text-gray-400 mt-6 text-center">
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
                                    <p className="text-gray-300 mb-6">
                                        We've received your demo request and will contact you shortly at <span className="text-blue-400">{watch('email')}</span>.
                                    </p>
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