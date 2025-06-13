import ClientOnboardingPage from "./onboarding";

export async function generateMetadate() {
  return {
    title: "Setup & Wizard | Liftora",
  };
}

const ClientOnboarding = () => {
  return <ClientOnboardingPage />;
};

export default ClientOnboarding;
