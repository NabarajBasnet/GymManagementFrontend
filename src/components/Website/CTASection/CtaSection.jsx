"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div className="relative overflow-hidden">
            {/* Background container with tilt */}
            <div className="absolute inset-0 overflow-hidden -skew-y-3 origin-top-left">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            {/* Content container */}
            <section className="cta-section py-32 text-white relative">
                <div className="container mx-auto px-4 relative z-10 skew-y-3">
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Ready to Automate Your Fitness Center?
                        </h2>
                        <p className="text-xl mb-8 text-white/95">
                            Join hundreds of successful fitness businesses that are growing with Fitbinary.
                            Start your 3 weeks free trial today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/register"
                                className="bg-white text-blue-600 px-8 py-4 rounded-full font-medium text-lg shadow-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                Start Free Trial <ArrowRight size={18} />
                            </a>
                            <a
                                href="#contact"
                                className="px-8 py-4 rounded-full border-2 border-white/30 hover:border-white/80 hover:bg-white/80 hover:text-cyan-600 text-white font-medium text-lg transition-all duration-300"
                            >
                                Contact Sales
                            </a>
                        </div>

                        <p className="mt-6 text-sm text-white/95">
                            No credit card required. Cancel anytime.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default CTASection;