"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Target, Users, Zap } from 'lucide-react';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const AboutSection = () => {
    // Initialize Lenis for smooth scrolling
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1,
            smooth: true,
            direction: 'vertical',
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    const [headingRef, headingInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [contentRef, contentInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const values = [
        {
            icon: <Users className="text-blue-500" size={24} />,
            title: "Customer Focus",
            description: "We build solutions that address real problems faced by gym owners and fitness professionals."
        },
        {
            icon: <Zap className="text-blue-500" size={24} />,
            title: "Innovation",
            description: "We're constantly improving our platform with the latest technology and industry best practices."
        },
        {
            icon: <Award className="text-blue-500" size={24} />,
            title: "Excellence",
            description: "We strive for excellence in every aspect of our product and customer service."
        },
        {
            icon: <Target className="text-blue-500" size={24} />,
            title: "Results-Driven",
            description: "We measure our success by the results we deliver to our customers and their businesses."
        }
    ];

    return (
        <section id="about" className="py-28 relative overflow-hidden bg-gray-950">
            {/* White Glowing Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full filter blur-[100px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.div
                    className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-white/5 rounded-full filter blur-[100px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full filter blur-[80px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    ref={headingRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-4xl mx-auto mb-20"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                        initial={{ opacity: 0 }}
                        animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Story</span> and Vision
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        We're passionate about transforming how fitness businesses operate and grow.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side - Image with Parallax Effect */}
                    <motion.div
                        initial={{ opacity: 0, x: -80 }}
                        animate={contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <motion.div
                            whileHover={{ scale: 0.98 }}
                            transition={{ duration: 0.5 }}
                            className="relative overflow-hidden rounded-2xl shadow-2xl"
                        >
                            <img
                                src="https://images.pexels.com/photos/3912944/pexels-photo-3912944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="Our Team"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </motion.div>

                        <motion.div
                            className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-xl shadow-xl backdrop-blur-sm border border-blue-500/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="font-bold text-white text-lg">Founded in 2024</p>
                            <p className="text-sm text-blue-100">Helping gyms grow since day one</p>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div
                        ref={contentRef}
                        initial={{ opacity: 0, x: 80 }}
                        animate={contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                        <motion.h3
                            className="text-3xl font-bold mb-6 text-white"
                            initial={{ opacity: 0 }}
                            animate={contentInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            From Gym Owners, <span className="text-blue-400">For Gym Owners</span>
                        </motion.h3>

                        <motion.p
                            className="text-gray-400 mb-6 text-md font-medium"
                            initial={{ opacity: 0 }}
                            animate={contentInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            GeoFit was founded by a team of fitness enthusiasts and technology experts who
                            saw firsthand the challenges gym owners face with outdated management systems.
                        </motion.p>

                        <motion.p
                            className="text-gray-400 mb-8 text-md font-medium"
                            initial={{ opacity: 0 }}
                            animate={contentInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            Our mission is to empower fitness businesses with technology that's powerful yet
                            simple to use, allowing them to focus on what they do best: helping their members
                            achieve their fitness goals.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={contentInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h3 className="text-3xl font-bold mb-8 text-white">Our Core Values</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {values.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-all"
                                        whileHover={{ y: -5 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                    >
                                        <div className="flex items-start">
                                            <div className="p-3 bg-blue-500/10 rounded-lg mr-4">
                                                {value.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg mb-2">{value.title}</h4>
                                                <p className="text-gray-400">{value.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;