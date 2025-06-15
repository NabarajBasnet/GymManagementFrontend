'use client'

import { useState } from "react";
import FirstStep from "./firststep";
import SecondStep from "./secondstep";
import ThirdStep from "./thirdstep";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

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

    const stepTitles = [
        "Business Information",
        "Configuration Settings", 
        "Final Setup"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <span className="text-2xl">🚀</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
                        Welcome to Liftora
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Transform your fitness business with our comprehensive management platform. 
                        Let's configure your workspace to match your unique needs.
                    </p>
                </div>

                {/* Progress Section */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    {currentStep}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Step {currentStep} of {totalSteps}
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {stepTitles[currentStep - 1]}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {Math.round((currentStep / totalSteps) * 100)}%
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <Progress 
                            value={(currentStep / totalSteps) * 100} 
                            className="h-3 bg-slate-200 dark:bg-slate-700" 
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20"></div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-8 lg:p-12">
                        {currentStep === 1 && <FirstStep />}
                        {currentStep === 2 && <SecondStep />}
                        {currentStep === 3 && <ThirdStep />}
                    </div>

                    {/* Navigation Footer */}
                    <div className="px-8 lg:px-12 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <Button
                                onClick={goPrevious}
                                disabled={currentStep === 1}
                                variant="outline"
                                className="px-6 py-3 dark:bg-white font-medium border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ← Previous
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={skipOnboarding}
                                className="px-6 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                            >
                                Skip setup for now
                            </Button>

                            <Button
                                onClick={goNext}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {currentStep === totalSteps ? 'Complete Setup →' : 'Continue →'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Need assistance with setup? Our team is here to help.{' '}
                        <a 
                            href="#" 
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                        >
                            Contact Support →
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClientOnboardingPage;