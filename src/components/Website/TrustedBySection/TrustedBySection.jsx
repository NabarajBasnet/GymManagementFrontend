"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star } from 'lucide-react';

const TrustedBySection = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const companies = [
        {
            name: "FitnessPro",
            logo: "https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&w=300",
            testimonial: "FitLoft transformed our operations completely."
        },
        {
            name: "GymElite",
            logo: "https://images.pexels.com/photos/3757954/pexels-photo-3757954.jpeg?auto=compress&cs=tinysrgb&w=300",
            testimonial: "Our member retention increased by 40%."
        },
        {
            name: "PowerFit",
            logo: "https://images.pexels.com/photos/4609806/pexels-photo-4609806.jpeg?auto=compress&cs=tinysrgb&w=300",
            testimonial: "The best investment we've made in our business."
        },
        {
            name: "StrongLife",
            logo: "https://images.pexels.com/photos/4254899/pexels-photo-4254899.jpeg?auto=compress&cs=tinysrgb&w=300",
            testimonial: "Streamlined all our processes in one platform."
        },
        {
            name: "FitZone",
            logo: "https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=300",
            testimonial: "Our staff and members love the new system."
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)"
        }
    };

    return (
        <section id="trusted" className="py-28 relative overflow-hidden bg-gray-900/40">
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
                        Trusted By <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Leading Gyms</span>
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Join 500+ fitness businesses worldwide that trust GeoFit to power their operations
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                >
                    {companies.map((company, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover="hover"
                            className="bg-white/5 backdrop-blur-sm cursor-pointer rounded-xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 mb-4">
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-white font-medium text-center mb-2">{company.name}</h3>
                                <p className="text-gray-400 text-sm text-center">{company.testimonial}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center cursor-pointer bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 hover:border-blue-400/30 transition-colors duration-200">
                        <Star className="text-yellow-400 fill-yellow-400/20 mr-2" size={18} />
                        <span className="text-white font-medium">500+ Gyms Worldwide</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrustedBySection;