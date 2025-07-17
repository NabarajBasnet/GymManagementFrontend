import ClientAreaLayout from "./clientLayout";

export async function generateMetadata() {
  return {
    title: "Clientarea - Dashboard - Fitbinary",
  };
}

const Layout = ({ children }) => {
  return <ClientAreaLayout>{children}</ClientAreaLayout>;
};

export default Layout;
