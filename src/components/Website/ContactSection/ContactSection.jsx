import React, { useState } from 'react';
import { Mail, Phone, MapPin, User, MessageSquare, Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitted(true);
        setIsSubmitting(false);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                message: ''
            });
        }, 3000);
    };

    return (
        <div id="contact" className="min-h-screen bg-gray-900/40 relative overflow-hidden">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-40 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 right-20 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-20 right-1/4 w-64 h-64 bg-white/15 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Side - Info */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                                    Let's Transform Your
                                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                                        Fitness Business
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    Ready to revolutionize your fitness center? Get in touch with our team and discover how our SaaS platform can streamline your operations.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 group">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                        <Mail className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Email Us</h3>
                                        <p className="text-gray-400">hello@fitbinary.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 group">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                        <Phone className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Call Us</h3>
                                        <p className="text-gray-400">+977 9763427690</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="relative">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                {!isSubmitted ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Get Started Today</h2>
                                            <p className="text-gray-300">Fill out the form below and we'll get back to you within 24 hours</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                    <User className="w-4 h-4" />
                                                    <span>Full Name</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Your full name"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span>Email Address</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span>Phone Number</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="(555) 123-4567"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Gym/Company Name</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Your gym name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>Message</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={4}
                                                required
                                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                                placeholder="Tell us about your gym and what you're looking for..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    <span>Send Message</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-8 h-8 text-green-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-4">Message Sent Successfully!</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}