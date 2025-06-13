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
            router.push('/clientarea/dashboard'); // or wherever you want
        }
    };

    const goPrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const skipOnboarding = () => {
        router.push('/clientarea/dashboard');
    };

    return (
        <div className="max-w-xl mx-auto py-10">
            {currentStep === 1 && <FirstStep />}
            {currentStep === 2 && <SecondStep />}
            {currentStep === 3 && <ThirdStep />}

            <div className="mt-8 flex justify-between">
                <Button
                    onClick={goPrevious}
                    disabled={currentStep === 1}
                    variant="outline"
                >
                    Previous
                </Button>

                <Button variant="ghost" onClick={skipOnboarding}>
                    Skip for now
                </Button>

                <Button onClick={goNext}>
                    {currentStep === totalSteps ? 'Finish' : 'Next'}
                </Button>
            </div>
        </div>
    );
};

export default ClientOnboardingPage;
