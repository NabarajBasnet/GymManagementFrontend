'use client';

import React, { useState } from 'react';
import {
    Send,
    User,
    Mail,
    Phone,
    Building,
    MessageCircle,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    Dumbbell
} from 'lucide-react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        gymSize: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setSubmitStatus('success');
            setIsSubmitting(false);
            // Reset form after successful submission
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                gymSize: '',
                message: ''
            });
        }, 2000);
    };

    const gymSizes = [
        { value: 'small', label: 'Small Gym (1-50 members)' },
        { value: 'medium', label: 'Medium Gym (51-200 members)' },
        { value: 'large', label: 'Large Gym (201-500 members)' },
        { value: 'enterprise', label: 'Enterprise (500+ members)' },
        { value: 'chain', label: 'Gym Chain/Franchise' }
    ];

    const InputField = ({ icon: Icon, label, type = 'text', name, value, onChange, placeholder, required = false }) => (
        <div className="group">
            <label className="block text-sm font-medium text-white/70 mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Icon className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                />
            </div>
        </div>
    );

    const SelectField = ({ icon: Icon, label, name, value, onChange, options, required = false }) => (
        <div className="group">
            <label className="block text-sm font-medium text-white/70 mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Icon className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/10 hover:border-white/20 appearance-none"
                >
                    <option value="" className="bg-gray-800 text-white">Select your gym size...</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    const TextareaField = ({ icon: Icon, label, name, value, onChange, placeholder, required = false }) => (
        <div className="group">
            <label className="block text-sm font-medium text-white/70 mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-4 z-10">
                    <Icon className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    rows="4"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/10 hover:border-white/20 resize-none"
                />
            </div>
        </div>
    );

    if (submitStatus === 'success') {
        return (
            <section id="contact" className="relative w-full min-h-screen bg-gray-950 overflow-hidden">
                {/* Same background effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-blue-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
                    <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-teal-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
                    <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40`} />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24 lg:px-10">
                    <div className="w-full max-w-2xl mx-auto text-center">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full mb-6">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4">
                                Thank You!
                            </h2>

                            <p className="text-white/60 mb-8 leading-relaxed">
                                Your message has been sent successfully. Our team will get back to you within 24 hours to discuss how Fitbinary can help grow your gym business.
                            </p>

                            <button
                                onClick={() => setSubmitStatus(null)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                            >
                                Send Another Message
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="relative w-full min-h-screen bg-gray-950 overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-blue-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
                <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-teal-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
                <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40`} />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24 lg:px-10">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                                    <Dumbbell className="w-4 h-4 text-blue-400 mr-2" />
                                    <span className="text-blue-400 text-sm font-medium">Get in Touch</span>
                                </div>

                                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                                    <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                                        Ready to Transform Your Gym?
                                    </span>
                                </h1>

                                <p className="text-xl text-white/60 leading-relaxed mb-8">
                                    Join hundreds of gym owners who trust Fitbinary to manage their fitness business. Let's discuss how we can help you grow.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                                        <Clock className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Quick Response</h3>
                                        <p className="text-white/60">We respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Free Consultation</h3>
                                        <p className="text-white/60">Personalized demo & setup guidance</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                                        <MapPin className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Global Support</h3>
                                        <p className="text-white/60">Supporting gyms worldwide</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        Get Started Today
                                    </h2>
                                    <p className="text-white/60">
                                        Tell us about your gym and we'll show you how Fitbinary can help
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField
                                        icon={User}
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                    <InputField
                                        icon={Mail}
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField
                                        icon={Phone}
                                        label="Phone Number"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    <InputField
                                        icon={Building}
                                        label="Gym Name"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Your Gym Name"
                                        required
                                    />
                                </div>

                                <SelectField
                                    icon={Dumbbell}
                                    label="Gym Size"
                                    name="gymSize"
                                    value={formData.gymSize}
                                    onChange={handleChange}
                                    options={gymSizes}
                                    required
                                />

                                <TextareaField
                                    icon={MessageCircle}
                                    label="Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your gym's needs, current challenges, or any specific questions you have about Fitbinary..."
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending Message...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </div>
                                    )}
                                </button>

                                <p className="text-center text-white/40 text-sm">
                                    By submitting this form, you agree to receive communications from Fitbinary about our gym management solutions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;