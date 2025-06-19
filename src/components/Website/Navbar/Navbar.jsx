"use client";

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowRight, Dumbbell, Users, Target, BookOpen, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const toggleDropdown = (index) => {
        if (activeDropdown === index) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(index);
        }
    };

    const handleMobileNavigation = (href) => {
        setIsOpen(false);
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    };

    const navLinks = [
        { name: 'Home', href: '#home' },
        {
            name: 'Features',
            href: '#features',
            hasDropdown: true,
            dropdownItems: [
                {
                    name: 'Premium Equipment',
                    href: '#features',
                    description: 'State-of-the-art machines and free weights for all fitness levels',
                    icon: Dumbbell
                },
                {
                    name: 'Group Classes',
                    href: '#features',
                    description: 'High-energy workouts led by certified instructors',
                    icon: Users
                },
                {
                    name: 'Personal Training',
                    href: '#features',
                    description: 'One-on-one coaching tailored to your specific goals',
                    icon: Target
                }
            ]
        },
        { name: 'Pricing', href: '#pricing' },
        {
            name: 'About',
            href: '#about',
            hasDropdown: true,
            dropdownItems: [
                {
                    name: 'Our Story',
                    href: '#about',
                    description: 'Learn about our mission to transform lives through fitness',
                    icon: BookOpen
                },
                {
                    name: 'Expert Team',
                    href: '#about',
                    description: 'Meet our certified trainers and wellness professionals',
                    icon: Heart
                },
                {
                    name: 'Member Success',
                    href: '#trusted',
                    description: 'Real stories from our community of achievers',
                    icon: Star
                }
            ]
        },
        { name: 'Contact', href: '#contact' },
        { name: 'FAQ', href: '#faq' },
    ];

    return (
        <nav
            className={cn(
                'fixed w-full z-50 transition-all duration-300 py-3',
                scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border-b border-gray-200/20 dark:border-gray-700/20' : 'bg-transparent'
            )}
        >
            <div className="container w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Enhanced Logo */}
                    <div className="flex items-center">
                        <a href="#" className="text-2xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Fit</span>
                            <span className={cn(
                                'transition-colors duration-300',
                                scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                            )}>Loft</span>
                        </a>
                    </div>

                    {/* Enhanced Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link, index) => (
                            <div key={link.name} className="relative group">
                                {link.hasDropdown ? (
                                    <button
                                        className={cn(
                                            'navbar-link text-sm font-medium transition-all duration-200 flex items-center hover:scale-105',
                                            scrolled ? 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400' : 'text-white/90 hover:text-white'
                                        )}
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        {link.name}
                                        <ChevronDown size={16} className="ml-1 transition-transform duration-200 group-hover:rotate-180" />
                                    </button>
                                ) : (
                                    <a
                                        href={link.href}
                                        className={cn(
                                            'navbar-link text-sm font-medium transition-all duration-200 hover:scale-105 relative',
                                            scrolled ? 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400' : 'text-white/90 hover:text-white'
                                        )}
                                    >
                                        {link.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                )}

                                {/* Enhanced Dropdown Menu */}
                                {link.hasDropdown && (
                                    <div className="absolute left-0 mt-3 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                {link.dropdownItems.map((item) => {
                                                    const IconComponent = item.icon;
                                                    return (
                                                        <a
                                                            key={item.name}
                                                            href={item.href}
                                                            className="group/item flex items-start p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-[1.02]"
                                                        >
                                                            <div className="flex-shrink-0 mr-4">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200">
                                                                    <IconComponent size={20} className="text-white" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors duration-200">
                                                                    {item.name}
                                                                </h4>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Enhanced CTA Buttons */}
                        <div className='flex items-center space-x-3'>
                            <Button
                                onClick={() => window.location.href = "/login"}
                                className={cn(
                                    "px-6 py-2.5 rounded-sm font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
                                    scrolled
                                        ? "bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 dark:bg-transparent dark:hover:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                                        : "bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20"
                                )}
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => window.location.href = "/register"}
                                className="px-6 py-2.5 rounded-sm font-medium shadow-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center group"
                            >
                                Get Started for Free
                                <ArrowRight size={16} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>

                    {/* Enhanced Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className={cn(
                                'p-2.5 rounded-xl focus:outline-none transition-all duration-200 hover:scale-110',
                                scrolled ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'
                            )}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Enhanced Mobile Menu */}
                <div
                    className={cn(
                        'lg:hidden fixed inset-x-0 top-20 transition-all duration-300 ease-out bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden border-t border-gray-200/20 dark:border-gray-700/20',
                        isOpen ? 'translate-y-0 opacity-100 max-h-screen' : '-translate-y-full opacity-0 max-h-0'
                    )}
                >
                    <div className="container mx-auto px-4 py-6 max-h-[80vh] overflow-y-auto">
                        <div className="space-y-2">
                            {navLinks.map((link, index) => (
                                <div key={link.name} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-2 last:pb-0">
                                    {link.hasDropdown ? (
                                        <div>
                                            <button
                                                onClick={() => toggleDropdown(index)}
                                                className="flex justify-between items-center w-full text-gray-900 dark:text-white text-base font-medium px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                            >
                                                {link.name}
                                                <ChevronDown
                                                    size={18}
                                                    className={cn(
                                                        'transition-transform duration-300',
                                                        activeDropdown === index ? 'rotate-180' : 'rotate-0'
                                                    )}
                                                />
                                            </button>

                                            {/* Enhanced Mobile Dropdown Items */}
                                            <div
                                                className={cn(
                                                    'bg-gray-50 dark:bg-gray-800/50 rounded-xl mx-2 overflow-hidden transition-all duration-300',
                                                    activeDropdown === index ? 'max-h-96 mt-2' : 'max-h-0'
                                                )}
                                            >
                                                <div className="p-2 space-y-1">
                                                    {link.dropdownItems.map((item) => {
                                                        const IconComponent = item.icon;
                                                        return (
                                                            <a
                                                                key={item.name}
                                                                href={item.href}
                                                                className="flex items-start p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleMobileNavigation(item.href);
                                                                }}
                                                            >
                                                                <div className="flex-shrink-0 mr-3">
                                                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                                        <IconComponent size={16} className="text-white" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {item.name}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                                                                        {item.description}
                                                                    </p>
                                                                </div>
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className="block text-gray-900 dark:text-white text-base font-medium px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleMobileNavigation(link.href);
                                            }}
                                        >
                                            {link.name}
                                        </a>
                                    )}
                                </div>
                            ))}

                            {/* Enhanced Mobile CTA Buttons */}
                            <div className="pt-6 space-y-3 border-t border-gray-200 dark:border-gray-700 mt-6">
                                <a
                                    href="/login"
                                    className="block w-full text-center px-6 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                >
                                    Login
                                </a>
                                <a
                                    href="/register"
                                    className="block w-full text-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center group"
                                >
                                    Get Started for Free
                                    <ArrowRight size={16} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;