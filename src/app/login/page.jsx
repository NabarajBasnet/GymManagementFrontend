import TenantLoginForm from "./form";

export const generateMetadata = () => {
  return {
    title: "Login | Liftora",
  };
};

const LoginPage = () => {
  return <TenantLoginForm />;
};

export default LoginPage;
