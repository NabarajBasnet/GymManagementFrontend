'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Globe,
    Shield,
    Heart,
    Award
} from 'lucide-react';

const Footer = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const socialLinks = [
        { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
        { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
        { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
        { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" }
    ];

    const products = [
        { name: "Features", href: "#" },
        { name: "Solutions", href: "#" },
        { name: "Integrations", href: "#" },
        { name: "Enterprise", href: "#" },
        { name: "Security", href: "#" }
    ];

    const solutions = [
        { name: "Documentation", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Guides", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "Blog", href: "#" }
    ];

    const company = [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Partners", href: "#" },
        { name: "Contact", href: "#" }
    ];

    const legal = [
        { name: "Privacy Policy", href: "/privacypolicy" },
        { name: "Terms of Service", href: "/termsofservice" },
        { name: "Cookie Policy", href: "/cookiepolicy" },
    ];

    return (
        <footer className="bg-gray-900 border-t border-gray-400 text-gray-300 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-400/10 rounded-full filter blur-[80px]"></div>
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full filter blur-[100px]"></div>
            </div>

            {/* Main Footer Content */}
            <motion.div
                className="container mx-auto px-4 py-16 relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
                    {/* Company Info */}
                    <motion.div
                        className="lg:col-span-2"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="text-2xl font-bold text-white mb-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">FitLoft</span>
                        </motion.div>
                        <p className="text-gray-400 text-sm mb-6">
                            The complete gym management solution trusted by fitness businesses worldwide.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-400">
                                <MapPin className="w-5 h-5 mr-3 text-cyan-400" />
                                <span className='text-sm'>44600 Kathmandu, Nepal</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <Mail className="w-5 h-5 mr-3 text-cyan-400" />
                                <a href="mailto:contact@fitloft.com" className="text-sm hover:text-cyan-400 transition-colors">
                                    contact@geofit.com
                                </a>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <Phone className="w-5 h-5 mr-3 text-cyan-400" />
                                <a href="tel:+9779800000000" className="text-sm hover:text-cyan-400 transition-colors">
                                    +977 9800000000
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Products */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-white mb-4">Products</h3>
                        <ul className="space-y-2">
                            {products.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-gray-400 text-sm hover:text-cyan-400 transition-colors"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Solutions */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {solutions.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-gray-400 text-sm hover:text-cyan-400 transition-colors"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            {company.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-gray-400 text-sm hover:text-cyan-400 transition-colors"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-400">
                                <Shield className="w-5 h-5 mr-2 text-cyan-400" />
                                <span className='text-sm'>PCI DSS Compliant</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <Award className="w-5 h-5 mr-2 text-cyan-400" />
                                <span className='text-sm'>99.9% Uptime</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Newsletter Subscription */}
                <motion.div
                    className="mt-16 p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700"
                    variants={itemVariants}
                >
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
                        <p className="text-gray-400 mb-6">
                            Subscribe to our newsletter for product updates and fitness industry insights.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-sm bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-sm font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors"
                            >
                                Subscribe
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} GeoFit. All rights reserved.
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>

                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            {legal.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-500 hover:text-cyan-400 transition-colors"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;