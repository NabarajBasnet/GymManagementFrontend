import TenantLoginForm from "./form";

export const generateMetadata = () => {
  return {
    title: "Login | Fitbinary",
  };
};

const LoginPage = () => {
  return <TenantLoginForm />;
};

export default LoginPage;
