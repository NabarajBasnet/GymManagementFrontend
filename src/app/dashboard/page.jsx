import { cookies } from 'next/headers';
import AdminDashboard from "./dashboard"

export async function generateMetadata(parent) {
  const cookieStore = cookies();
  const token = cookieStore.get('tenantLoginToken')?.value;

  const res = await fetch(`http://localhost:3000/api/tenant/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const tenant = await res.json();
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: tenant?.tenant?.organization?.name ?? 'Dashboard',
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  };
}

const Dashboard = () => {
  return (
    <AdminDashboard />
  )
}
export default Dashboard;
