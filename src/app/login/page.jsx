import TenantLoginForm from "./form";

export const generateMetadata = () => {
  return {
    title: "Login | GeoFit",
  };
};

const LoginPage = () => {
  return <TenantLoginForm />;
};

export default LoginPage;
