"use client";

import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast as sonnertoast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import React, { useState, useEffect } from "react";
import {
    Check,
    Zap,
    Crown,
    Sparkles,
    ArrowRight,
    Loader2,
    Star,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
    const [loadingButtons, setLoadingButtons] = useState({});
    const router = useRouter();

    const [orgSetupDialog, setOrgSetupDialog] = useState(false);
    const [resBody, setResBody] = useState();

    const fetchPlans = async () => {
        try {
            const response = await fetch(
                `https://fitbinary.com/api/subscription/getall`
            );
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            sonnertoast.error("Error fetching plans:", error.error);
            console.error("Error fetching plans:", error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["plans"],
        queryFn: fetchPlans,
    });

    const { subscriptions } = data || {};

    const getPlanIcon = (index) => {
        const icons = [Zap, Crown, Sparkles];
        return icons[index] || Star;
    };

    const getPlanGradient = (index) => {
        const gradients = [
            "from-blue-500 to-cyan-500",
            "from-purple-500 to-pink-500",
            "from-orange-500 to-red-500"
        ];
        return gradients[index] || "from-gray-500 to-gray-600";
    };

    const getPlanCardBg = (index) => {
        const backgrounds = [
            "bg-gradient-to-br from-gray-800 to-gray-900",
            "bg-gradient-to-br from-gray-900 to-gray-800",
            "bg-gradient-to-br from-gray-800 to-gray-950"
        ];
        return backgrounds[index] || "bg-gray-900";
    };

    const getPlanAccent = (index) => {
        const accents = [
            "blue",
            "purple",
            "orange"
        ];
        return accents[index] || "gray";
    };

    return (
        <section className="w-full min-h-screen bg-gray-900 relative overflow-hidden flex items-center">
            {/* Enhanced Glowing Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-40 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float1"></div>
                <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float2"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl animate-float3"></div>
                <div className="absolute top-20 right-1/4 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-pulse"></div>

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]"></div>
            </div>

            <style jsx>{`
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-20px, -20px); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(20px, 20px); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(-50%, -50%); }
                    50% { transform: translate(-55%, -45%); }
                }
                .animate-float1 { animation: float1 12s ease-in-out infinite; }
                .animate-float2 { animation: float2 15s ease-in-out infinite; }
                .animate-float3 { animation: float3 18s ease-in-out infinite; }
            `}</style>

            <AlertDialog open={orgSetupDialog} onOpenChange={setOrgSetupDialog}>
                <AlertDialogContent className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-md">
                    <AlertDialogHeader className="flex items-start gap-4 p-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-900/30 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="text-amber-400 w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <AlertDialogTitle className="text-xl font-semibold text-white">
                                Complete Your Organization Setup
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm mt-2 text-gray-300 leading-relaxed">
                                {resBody?.message || "To access all features and start managing your gym efficiently, please complete the remaining onboarding steps."}
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex gap-3 p-6 pt-0">
                        <AlertDialogCancel className="flex-1 bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 rounded-xl">
                            Not Now
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.push(resBody?.redirect)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 rounded-xl shadow-lg"
                        >
                            Complete Setup
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                    <Loader />
                </div>
            ) : Array.isArray(subscriptions) && subscriptions.length > 0 ? (
                <div className="w-full relative z-10">

                    {/* Hero Section */}
                    <div className="pt-20 pb-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <div className="inline-flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-8">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-gray-300">
                                    Choose the perfect plan for your gym
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                Unlock Your Gym's
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                    Full Potential
                                </span>
                            </h1>

                            <p className="text-md sm:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                                Transform your fitness business with our comprehensive management platform.
                                From boutique studios to enterprise facilities, we scale with your success.
                            </p>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            {subscriptions.map((plan, index) => {
                                const Icon = getPlanIcon(index);
                                const isPopular = index === 1;
                                const gradient = getPlanGradient(index);
                                const cardBg = getPlanCardBg(index);
                                const accent = getPlanAccent(index);

                                return (
                                    <div
                                        key={plan._id}
                                        className={`relative group ${isPopular
                                            ? "lg:scale-105 lg:-mt-4 lg:mb-4"
                                            : "hover:scale-[1.02]"
                                            } transition-all duration-500 ease-out`}
                                    >
                                        {/* Popular Badge */}
                                        {isPopular && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                                    <Star className="w-4 h-4 inline mr-1" />
                                                    Most Popular
                                                </div>
                                            </div>
                                        )}

                                        {/* Card */}
                                        <div className={`relative ${cardBg} backdrop-blur-sm rounded-3xl p-8 border transition-all duration-500 h-full flex flex-col group-hover:shadow-2xl ${isPopular
                                            ? "border-purple-500/30 shadow-xl shadow-purple-900/20"
                                            : "border-gray-700 shadow-lg hover:border-gray-600"
                                            }`}>

                                            {/* Plan Header */}
                                            <div className="relative z-10 flex-1">
                                                {/* Icon */}
                                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-6 shadow-lg`}>
                                                    <Icon className="w-8 h-8 text-white" />
                                                </div>

                                                {/* Plan Name & Description */}
                                                <h3 className="text-2xl font-bold text-white mb-3">
                                                    {plan.subscriptionName}
                                                </h3>
                                                <p className="text-gray-300 mb-6 leading-relaxed">
                                                    {plan.subscriptionDescription}
                                                </p>

                                                {/* Pricing */}
                                                <div className="mb-8">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl lg:text-6xl font-bold text-white">
                                                            {plan.currency}{plan.subscriptionPrice}
                                                        </span>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-400 text-lg font-medium">
                                                                /month
                                                            </span>
                                                            <span className="text-gray-500 text-sm">
                                                                per location
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Features */}
                                                <div className="space-y-4 mb-8">
                                                    {plan.subscriptionFeatures.map((feature, featureIndex) => (
                                                        <div
                                                            key={featureIndex}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mt-0.5 shadow-sm`}>
                                                                <CheckCircle className="w-4 h-4 text-white" />
                                                            </div>
                                                            <span className="text-gray-300 leading-relaxed">
                                                                {feature}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CTA Section */}
                                            <div className="mt-auto pt-6 border-t border-gray-700">
                                                <button
                                                    onClick={() => window.location.href = '/login'}
                                                    disabled={loadingButtons[plan._id]}
                                                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn ${isPopular
                                                        ? `bg-gradient-to-r ${gradient} hover:shadow-lg hover:shadow-${accent}-500/25 text-white transform hover:-translate-y-0.5`
                                                        : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                                                        } ${loadingButtons[plan._id] ? "opacity-75 cursor-not-allowed" : ""}`}
                                                >
                                                    {loadingButtons[plan._id] ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <>
                                                            Get Started
                                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </button>

                                                {/* Guarantee */}
                                                <div className="flex items-center justify-center gap-2 mt-4">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    <span className="text-sm text-gray-400">
                                                        30-day money-back guarantee
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* FAQ Section */}
                        <div className="mt-24">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                                    Everything you need to know about our pricing and plans
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                                {[
                                    {
                                        question: "Can I change my plan later?",
                                        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated automatically."
                                    },
                                    {
                                        question: "Is there a free trial?",
                                        answer: "All plans come with a 14-day free trial. No credit card required to start exploring our platform."
                                    },
                                    {
                                        question: "What payment methods do you accept?",
                                        answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
                                    },
                                    {
                                        question: "Do you offer refunds?",
                                        answer: "Yes, we offer a 30-day money-back guarantee on all plans, no questions asked."
                                    }
                                ].map((faq, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
                                    >
                                        <h3 className="text-lg lg:text-xl font-semibold text-white mb-3">
                                            {faq.question}
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
                    <div className="max-w-md w-full bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-700 shadow-xl text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Star className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">
                            No Plans Available
                        </h1>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Subscription plans haven't been configured yet. Please check back later or contact support.
                        </p>
                        <Button
                            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg"
                            onClick={() => router.push("/clientarea/dashboard")}
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PricingSection;