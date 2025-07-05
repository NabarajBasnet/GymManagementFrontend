import ClientLayout from "./clientLayout";

export const metadata = {
  title: "Fitbinary | Enterprise Gym Management System",
  description: "Fitbinary Enterprise Gym Management System",
};

export default function DashboardLayout({ children }) {
  return (
    <ClientLayout>
      <div className="w-full">{children}</div>
    </ClientLayout>
  );
}
