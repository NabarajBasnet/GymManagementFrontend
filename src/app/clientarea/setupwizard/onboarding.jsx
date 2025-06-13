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
            router.push('/clientarea/dashboard');
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

    return (
        <div className="w-full dark:bg-gray-900 mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl dark:bg-gray-900 mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl dark:text-gray-200 font-bold text-gray-900 mb-2">🎉 Welcome to Liftora</h1>
                    <p className="text-sm dark:text-gray-300 font-medium text-gray-600">Let's get your organization set up in just a few steps</p>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Step {currentStep} of {totalSteps}</span>
                        <span className="text-sm font-medium text-primary dark:text-gray-200">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
                    </div>
                    <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
                </div>

                <div className="bg-white rounded-lg dark:bg-gray-800 shadow-xl p-6 sm:p-8">
                    {currentStep === 1 && <FirstStep />}
                    {currentStep === 2 && <SecondStep />}
                    {currentStep === 3 && <ThirdStep />}

                    <div className="mt-8 flex justify-between">
                        <Button
                            onClick={goPrevious}
                            disabled={currentStep === 1}
                            variant="outline"
                            className="w-24 dark:bg-white dark:text-black"
                        >
                            Previous
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={skipOnboarding}
                            className="text-gray-600 dark:bg-gray-900 dark:text-gray-200 hover:text-gray-800"
                        >
                            Skip setup
                        </Button>

                        <Button
                            onClick={goNext}
                            className="w-24"
                        >
                            {currentStep === totalSteps ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
                </div>
            </div>
        </div>
    );
};

export default ClientOnboardingPage;