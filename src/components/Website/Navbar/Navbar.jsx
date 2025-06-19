"use client";

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
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
        }, 300); // Match this with your transition duration
    };

    const navLinks = [
        { name: 'Home', href: '#home' },
        {
            name: 'Features',
            href: '#features',
            hasDropdown: true,
            dropdownItems: [
                { name: 'Equipment', href: '#features' },
                { name: 'Classes', href: '#features' },
                { name: 'Personal Training', href: '#features' }
            ]
        },
        { name: 'Pricing', href: '#pricing' },
        {
            name: 'About',
            href: '#about',
            hasDropdown: true,
            dropdownItems: [
                { name: 'Our Story', href: '#about' },
                { name: 'Team', href: '#about' },
                { name: 'Testimonials', href: '#trusted' }
            ]
        },
        { name: 'Contact', href: '#contact' },
        { name: 'FAQ', href: '#faq' },
    ];

    return (
        <nav
            className={cn(
                'fixed w-full z-50 transition-all duration-300 py-4',
                scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'
            )}
        >
            <div className="container w-full mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="#" className="text-2xl font-bold">
                            <span className="gradient-text">Fit</span>
                            <span className={scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}>Loft</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link, index) => (
                            <div key={link.name} className="relative group">
                                {link.hasDropdown ? (
                                    <button
                                        className={cn(
                                            'navbar-link text-sm font-medium transition-colors duration-200 flex items-center',
                                            scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                                        )}
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        {link.name}
                                        <ChevronDown size={16} className="ml-1" />
                                    </button>
                                ) : (
                                    <a
                                        href={link.href}
                                        className={cn(
                                            'navbar-link text-sm font-medium transition-colors duration-200',
                                            scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                                        )}
                                    >
                                        {link.name}
                                    </a>
                                )}

                                {/* Dropdown Menu */}
                                {link.hasDropdown && (
                                    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="py-2">
                                            {link.dropdownItems.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className="block px-5 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* CTA Button with Icon */}
                        <div className='flex items-center justify-between space-x-3'>
                            <Button
                                href="/login"
                                className={cn(
                                    "px-6 py-2 rounded-sm font-medium shadow-lg flex items-center transition-all duration-300",
                                    scrolled
                                        ? "bg-white hover:bg-indigo-700 text-indigo-600 hover:text-white"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                )}
                            >
                                Login
                            </Button>
                            <a
                                href="/register"
                                className={cn(
                                    "px-6 py-2 rounded-sm font-medium shadow-lg flex items-center transition-all duration-300",
                                    scrolled
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                        : "bg-white hover:bg-gray-100 text-indigo-600"
                                )}
                            >
                                Get Started for Free
                                <ArrowRight size={16} className="ml-2" />
                            </a>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className={cn(
                                'p-2 rounded-md focus:outline-none',
                                scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                            )}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Enhanced Mobile Menu */}
                <div
                    className={cn(
                        'md:hidden fixed inset-x-0 top-16 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-lg z-50 overflow-hidden',
                        isOpen ? 'translate-y-0 opacity-100 h-auto' : '-translate-y-full opacity-0 h-0'
                    )}
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col space-y-1">
                            {navLinks.map((link, index) => (
                                <div key={link.name} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    {link.hasDropdown ? (
                                        <div>
                                            <button
                                                onClick={() => toggleDropdown(index)}
                                                className="flex justify-between items-center w-full text-gray-900 dark:text-white text-sm font-medium px-2 py-3"
                                            >
                                                {link.name}
                                                <ChevronDown
                                                    size={16}
                                                    className={cn(
                                                        'transition-transform duration-200',
                                                        activeDropdown === index ? 'rotate-180' : 'rotate-0'
                                                    )}
                                                />
                                            </button>

                                            {/* Mobile Dropdown Items */}
                                            <div
                                                className={cn(
                                                    'bg-gray-50 dark:bg-gray-800 overflow-hidden transition-all duration-200',
                                                    activeDropdown === index ? 'max-h-60' : 'max-h-0'
                                                )}
                                            >
                                                {link.dropdownItems.map((item) => (
                                                    <a
                                                        key={item.name}
                                                        href={item.href}
                                                        className="block px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleMobileNavigation(item.href);
                                                        }}
                                                    >
                                                        {item.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className="block text-gray-900 dark:text-white text-sm font-medium px-2 py-3"
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

                            {/* Mobile Login & CTA Buttons */}
                            <div className="pt-2 space-y-3">
                                <a
                                    href="/login"
                                    className="block w-full text-center px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium shadow-sm"
                                >
                                    Login
                                </a>
                                <a
                                    href="/register"
                                    className="btn-primary w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-center px-6 py-3 rounded-full text-white font-medium shadow-md flex items-center justify-center"
                                >
                                    Get Started for Free
                                    <ArrowRight size={16} className="ml-2" />
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
