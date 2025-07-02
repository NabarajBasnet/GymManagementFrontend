import TenantSignUpPage from "./register";

export async function generateMetadata() {
  return {
    title: "Register | Fitbinary | Enterprise Fitness Management Service",
  };
}

const registerPage = () => {
  return <TenantSignUpPage />;
};
export default registerPage;
