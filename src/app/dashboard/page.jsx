import { cookies } from 'next/headers';
import AdminDashboard from "./dashboard";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const token = cookieStore.get('loginToken')?.value;

  const res = await fetch(`http://88.198.112.156:3100/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data = await res.json();

  return {
    title: data?.user?.organization?.name ?? 'Dashboard',
  };
}

const Dashboard = () => {
  return <AdminDashboard />;
};

export default Dashboard;
