"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const PricingSection = () => {
    const [annual, setAnnual] = useState(false);
    const [hoveredPlan, setHoveredPlan] = useState(null);

    const [headingRef, headingInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const plans = [
        {
            name: "Starter",
            price: annual ? 29 : 39,
            description: "Perfect for small gyms just getting started",
            features: [
                "Up to 100 members",
                "Basic attendance tracking",
                "Member profiles",
                "Payment processing",
                "Email support",
            ],
            notIncluded: [
                "Staff management",
                "Advanced analytics",
                "API access",
                "Custom branding",
            ],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Professional",
            price: annual ? 79 : 99,
            description: "Ideal for growing fitness businesses",
            features: [
                "Up to 500 members",
                "Advanced attendance tracking",
                "Comprehensive member profiles",
                "Payment processing",
                "Staff management",
                "Basic analytics",
                "Email and chat support",
                "Mobile app access",
            ],
            notIncluded: [
                "API access",
                "Custom branding",
            ],
            cta: "Get Started",
            popular: true,
        },
        {
            name: "Enterprise",
            price: annual ? 149 : 199,
            description: "For large gyms and fitness chains",
            features: [
                "Unlimited members",
                "Advanced attendance tracking",
                "Comprehensive member profiles",
                "Payment processing",
                "Staff management",
                "Advanced analytics & reporting",
                "Priority support 24/7",
                "Mobile app access",
                "API access",
                "Custom branding",
                "Multi-location support",
            ],
            notIncluded: [],
            cta: "Contact Sales",
            popular: false,
        }
    ];

    const glowVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 0.8 },
    };

    return (
        <section id="pricing" className="py-28 relative overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900">
            {/* Animated Background Glow Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 -left-20 w-96 h-96 bg-white/5 rounded-full filter blur-[100px]"
                    initial="hidden"
                    animate="visible"
                    variants={glowVariants}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.div
                    className="absolute bottom-1/3 -right-20 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[100px]"
                    initial="hidden"
                    animate="visible"
                    variants={glowVariants}
                    transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[100px]"
                    initial="hidden"
                    animate="visible"
                    variants={glowVariants}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    ref={headingRef}
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                        initial={{ opacity: 0 }}
                        animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Simple, Transparent Pricing
                    </motion.h2>
                    <motion.p
                        className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Choose the plan that works best for your fitness business.
                        All plans include our core features to get you started.
                    </motion.p>

                    {/* Toggle */}
                    <motion.div
                        className="flex items-center justify-center space-x-4 mb-2"
                        initial={{ opacity: 0 }}
                        animate={headingInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <span className={`text-md font-medium ${!annual ? 'text-white' : 'text-gray-500'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setAnnual(!annual)}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${annual ? 'bg-blue-600' : 'bg-gray-600'}`}
                        >
                            <motion.span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${annual ? 'translate-x-7' : 'translate-x-1'}`}
                                layout
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`text-md font-medium ${annual ? 'text-white' : 'text-gray-500'}`}>
                            Annual <span className="text-green-400">(Save 25%)</span>
                        </span>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <AnimatePresence>
                        {plans.map((plan, index) => {
                            const [ref, inView] = useInView({
                                triggerOnce: true,
                                threshold: 0.1,
                            });

                            return (
                                <motion.div
                                    key={index}
                                    ref={ref}
                                    className={`relative h-full ${plan.popular ? 'md:mt-[-20px]' : ''}`}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                    transition={{ duration: 0.6, delay: index * 0.15, ease: "backOut" }}
                                    whileHover={{ y: -10 }}
                                    onHoverStart={() => setHoveredPlan(index)}
                                    onHoverEnd={() => setHoveredPlan(null)}
                                >
                                    {plan.popular && (
                                        <motion.div
                                            className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                            transition={{ delay: index * 0.15 + 0.3 }}
                                        >
                                            <div className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold py-2 px-4 rounded-full shadow-lg">
                                                <Star size={14} className="mr-2 fill-yellow-300 text-yellow-300" />
                                                MOST POPULAR
                                            </div>
                                        </motion.div>
                                    )}
                                    <div className={`h-full rounded-xl overflow-hidden border transition-all duration-300 ${hoveredPlan === index ? 'shadow-2xl' : 'shadow-lg'} ${plan.popular ? 'bg-gradient-to-b from-gray-900 to-gray-800 border-blue-500/30' : 'bg-gray-900/70 border-gray-800'}`}>
                                        <div className="p-8 h-full flex flex-col">
                                            <div className="mb-6">
                                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                                <p className="text-gray-400 text-sm">{plan.description}</p>
                                            </div>

                                            <div className="mb-8">
                                                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">${plan.price}</span>
                                                <span className="text-gray-400">/month</span>
                                                {annual && (
                                                    <p className="text-green-400 text-sm mt-1">Billed annually (${plan.price * 12})</p>
                                                )}
                                            </div>

                                            <motion.button
                                                className={`w-full py-3 rounded-lg mb-8 font-medium transition-all ${plan.popular
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {plan.cta}
                                            </motion.button>

                                            <div className="border-t border-gray-800 pt-6 mb-6"></div>

                                            <div className="space-y-4 flex-grow">
                                                <h4 className="text-white font-medium mb-2">What's included:</h4>
                                                <ul className="space-y-3">
                                                    {plan.features.map((feature, i) => (
                                                        <motion.li
                                                            key={`included-${i}`}
                                                            className="flex items-start"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                                            transition={{ delay: index * 0.15 + 0.1 + i * 0.05 }}
                                                        >
                                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center mr-3 mt-0.5">
                                                                <Check size={12} className="text-green-400" />
                                                            </div>
                                                            <span className="text-gray-300 text-sm">{feature}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>

                                                {plan.notIncluded.length > 0 && (
                                                    <>
                                                        <h4 className="text-gray-500 font-medium mt-6 mb-2">Not included:</h4>
                                                        <ul className="space-y-3">
                                                            {plan.notIncluded.map((feature, i) => (
                                                                <motion.li
                                                                    key={`not-included-${i}`}
                                                                    className="flex items-start opacity-70"
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={inView ? { opacity: 0.7, x: 0 } : { opacity: 0, x: -10 }}
                                                                    transition={{ delay: index * 0.15 + 0.2 + i * 0.05 }}
                                                                >
                                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center mr-3 mt-0.5">
                                                                        <X size={12} className="text-red-400" />
                                                                    </div>
                                                                    <span className="text-white text-sm">{feature}</span>
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;