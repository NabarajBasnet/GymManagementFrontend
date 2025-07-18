import ClientLayout from "./clientLayout";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const cookieStore = cookies();
  const token = cookieStore.get("loginToken")?.value;

  const res = await fetch(`https://fitbinary.com/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  const orgName = data?.user?.organization?.name ?? "Dashboard";

  return {
    title: `${orgName} | Dashboard`,
  };
}

export default function DashboardLayout({ children }) {
  return (
    <ClientLayout>
      <div className="w-full">{children}</div>
    </ClientLayout>
  );
}
