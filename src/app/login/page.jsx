import TenantLoginForm from "./form";

export const generateMetadata = () => {
  return {
    title: "Login | Fitbinary",
    description: "Login to your Fitbinary gym dashboard. Manage members, attendance, and billing in one place.",
    robots: "index, follow", 
    openGraph: {
      title: "Login | Fitbinary",
      description: "Access your Fitbinary gym management dashboard.",
      url: "http://localhost:3000/login",
      siteName: "Fitbinary",
      images: [
        {
          url: "http://localhost:3000/og-image.png",
          width: 1200,
          height: 630,
          alt: "Fitbinary Login",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Login | Fitbinary",
      description: "Login to manage your gym with Fitbinary.",
      images: ["http://localhost:3000/og-image.png"],
    },
  };
};

const LoginPage = () => {
  return <TenantLoginForm />;
};

export default LoginPage;
