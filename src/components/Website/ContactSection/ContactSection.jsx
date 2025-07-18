'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const [submitStatus, setSubmitStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const gymSizes = [
        { value: 'small', label: 'Small Gym (1-50 members)' },
        { value: 'medium', label: 'Medium Gym (51-200 members)' },
        { value: 'large', label: 'Large Gym (201-500 members)' },
        { value: 'enterprise', label: 'Enterprise (500+ members)' },
        { value: 'chain', label: 'Gym Chain/Franchise' }
    ];

    const onSubmit = async (data) => {
        try {
            const response = await fetch('https://fitbinary.com/api/contact/create-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: data.name,
                    email: data.email,
                    phone: data.phone,
                    gymName: data.company,
                    gymSize: data.gymSize,
                    message: data.message
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            setSubmitStatus('success');
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    const InputField = ({ icon: Icon, label, type = 'text', name, placeholder, required = false }) => (
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
                    {...register(name, { required: required && `${label} is required` })}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                />
            </div>
            {errors[name] && <p className="mt-1 text-sm text-red-400">{errors[name].message}</p>}
        </div>
    );

    const SelectField = ({ icon: Icon, label, name, options, required = false }) => (
        <div className="group">
            <label className="block text-sm font-medium text-white/70 mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Icon className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <select
                    {...register(name, { required: required && `${label} is required` })}
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
            {errors[name] && <p className="mt-1 text-sm text-red-400">{errors[name].message}</p>}
        </div>
    );

    const TextareaField = ({ icon: Icon, label, name, placeholder, required = false }) => (
        <div className="group">
            <label className="block text-sm font-medium text-white/70 mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-4 z-10">
                    <Icon className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <textarea
                    {...register(name, { required: required && `${label} is required` })}
                    placeholder={placeholder}
                    rows="4"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/10 hover:border-white/20 resize-none"
                />
            </div>
            {errors[name] && <p className="mt-1 text-sm text-red-400">{errors[name].message}</p>}
        </div>
    );

    if (submitStatus === 'success') {
        return (
            <section id="contact" className="relative w-full min-h-screen bg-gray-950 overflow-hidden">
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24 lg:px-10">
                    <div className="w-full max-w-2xl mx-auto text-center">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
                            <div className="inline-flex items-center justify-center w-16 h-16  rounded-full mb-6">
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

    if (submitStatus === 'error') {
        return (
            <section id="contact" className="relative w-full min-h-screen bg-gray-950 overflow-hidden">
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24 lg:px-10">
                    <div className="w-full max-w-2xl mx-auto text-center">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
                            <div className="inline-flex items-center justify-center w-16 h-16  rounded-full mb-6">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4">
                                Submission Failed
                            </h2>

                            <p className="text-white/60 mb-8 leading-relaxed">
                                {errorMessage}
                            </p>

                            <button
                                onClick={() => setSubmitStatus(null)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="relative w-full min-h-screen bg-gray-950 overflow-hidden">

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
                            <form onSubmit={handleSubmit(onSubmit)}>
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
                                            placeholder="John Doe"
                                            required
                                        />
                                        <InputField
                                            icon={Mail}
                                            label="Email Address"
                                            type="email"
                                            name="email"
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
                                            placeholder="+1 (555) 123-4567"
                                        />
                                        <InputField
                                            icon={Building}
                                            label="Gym Name"
                                            name="company"
                                            placeholder="Your Gym Name"
                                            required
                                        />
                                    </div>

                                    <SelectField
                                        icon={Dumbbell}
                                        label="Gym Size"
                                        name="gymSize"
                                        options={gymSizes}
                                        required
                                    />

                                    <TextareaField
                                        icon={MessageCircle}
                                        label="Message"
                                        name="message"
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;