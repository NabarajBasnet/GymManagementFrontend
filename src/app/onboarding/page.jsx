import ClientOnboardingPage from "../clientarea/setupwizard/onboarding";

export async function generateMetadata() {
    return {
        title: "Welcome & Setup Wizard | Liftora",
    };
}

const ClientOnboarding = () => {
    return <ClientOnboardingPage />;
};

export default ClientOnboarding;
