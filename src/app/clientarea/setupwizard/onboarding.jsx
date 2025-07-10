'use client'

import { useState } from "react";
import FirstStep from "./firststep";
import SecondStep from "./secondstep";
import ThirdStep from "./thirdstep";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ClientOnboardingPage = () => {
    const totalSteps = 3;
    const [currentStep, setCurrentStep] = useState(1);
    const router = useRouter();

    const goNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        } else {
            // mark onboarding complete (e.g., API call) then redirect
            window.location.href = '/clientarea/dashboard';
        }
    };

    const goPrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const skipOnboarding = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organization/skip-onboarding`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            router.push('/clientarea/dashboard');
        } else {
            console.error('Failed to skip onboarding');
        }
    };

    const stepData = [
        {
            title: "Business Information",
            description: "Tell us about your fitness business",
            icon: "🏢"
        },
        {
            title: "Configuration Settings",
            description: "Customize your platform preferences",
            icon: "⚙️"
        },
        {
            title: "Final Setup",
            description: "Complete your workspace setup",
            icon: "✨"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.05)_1px,transparent_0)] [background-size:24px_24px]"></div>

            <div className="relative container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2 leading-tight">
                        Welcome to Fitbinary
                    </h1>
                    <p className="text-md text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
                        Transform your fitness business with our comprehensive management platform.
                        <br />
                        <span className="text-indigo-600 text-sm dark:text-indigo-400 font-semibold">Let's get you set up in just 2 simple steps.</span>
                    </p>
                </div>

                {/* Progress Steps Visualization */}
                <div className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                        {stepData.map((step, index) => (
                            <div key={index} className="flex items-center">
                                {/* Step Circle */}
                                <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-500 ${index + 1 <= currentStep
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 scale-110'
                                    : index + 1 === currentStep + 1
                                        ? 'bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600'
                                        : 'bg-slate-100 dark:bg-slate-800'
                                    }`}>
                                    {index + 1 < currentStep ? (
                                        <div className="text-white text-xl">✓</div>
                                    ) : index + 1 === currentStep ? (
                                        <div className="text-white text-xl font-bold">{index + 1}</div>
                                    ) : (
                                        <div className="text-slate-400 dark:text-slate-500 text-xl font-bold">{index + 1}</div>
                                    )}

                                    {/* Pulsing ring for current step */}
                                    {index + 1 === currentStep && (
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse opacity-20"></div>
                                    )}
                                </div>

                                {/* Connector Line */}
                                {index < stepData.length - 1 && (
                                    <div className={`h-1 w-20 mx-4 rounded-full transition-all duration-500 ${index + 1 < currentStep
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step Labels */}
                    <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {stepData.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="text-md">{step.icon}</div>
                                <h3 className={`font-bold text-lg transition-colors duration-300 ${index + 1 === currentStep
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {step.title}
                                </h3>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-500 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                            Progress
                        </span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {Math.round((currentStep / totalSteps) * 100)}%
                        </span>
                    </div>
                    <div className="relative">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 rounded-full transition-all duration-700 ease-out shadow-lg"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                        <div className="absolute inset-0 h-3 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-cyan-600/20 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
                    {/* Content Area */}
                    <div className="p-4 md:p-8">
                        <div className="transform transition-all duration-500">
                            {currentStep === 1 && <FirstStep />}
                            {currentStep === 2 && <SecondStep />}
                            {currentStep === 3 && <ThirdStep />}
                        </div>
                    </div>

                    {/* Navigation Footer */}
                    <div className="px-8 lg:px-16 py-8 bg-gradient-to-r from-slate-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-900/50 border-t border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            {/* Previous Button */}
                            <Button
                                onClick={goPrevious}
                                disabled={currentStep === 1}
                                variant="outline"
                                className="w-full lg:w-auto px-8 py-4 font-semibold border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 rounded-xl"
                            >
                                <span className="flex text-primary items-center gap-2">
                                    ← Previous Step
                                </span>
                            </Button>

                            {/* Center Actions */}
                            <div className="flex flex-col lg:flex-row items-center gap-4">
                                {/* Skip Button */}
                                <Button
                                    variant="ghost"
                                    onClick={skipOnboarding}
                                    className="px-6 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300"
                                >
                                    Skip setup for now
                                </Button>

                                {/* Next/Complete Button */}
                                <Button
                                    onClick={goNext}
                                    className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 rounded-xl transform hover:scale-105"
                                >
                                    <span className="flex items-center gap-2">
                                        {currentStep === totalSteps ? (
                                            <>Complete Setup <span className="text-xl">🎉</span></>
                                        ) : (
                                            <>Continue <span className="text-lg">→</span></>
                                        )}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg">
                        <span className="text-lg">🤝</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                            Need help?
                        </span>
                        <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold hover:underline transition-colors duration-300"
                        >
                            Contact Support →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientOnboardingPage;