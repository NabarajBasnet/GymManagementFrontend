import LoggedInStaffProvider from "@/components/Providers/LoggedInStaffProvider";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import StaffHeader from "./Header";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const token = cookieStore.get("staffLoginToken")?.value;

  const res = await fetch(`https://fitbinary.com/api/loggedin-staff`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!data?.success || !data?.loggedInStaff) {
    return {
      title: "Staff Login - Gym Dashboard",
      description: "Please login to access the staff portal.",
    };
  }

  const staff = data.loggedInStaff;
  const orgName = staff?.organization?.name ?? "Gym";
  const staffName = staff?.fullName ?? "Staff";
  const role = staff?.role ?? "";
  const branch = staff?.organizationBranch?.orgBranchName ?? "";

  return {
    title: `${orgName} | ${staffName} (${role})`,
    description: `${staffName} - ${role} at ${orgName}${
      branch ? " | " + branch : ""
    }.`,
    keywords: [
      staffName,
      role,
      orgName,
      "Gym Admin",
      "Fitness Dashboard",
      "Gym Staff Panel",
      "Gym Nepal",
    ],
    openGraph: {
      title: `${orgName} | ${staffName} (${role})`,
      description: `${staffName} is logged in as ${role} at ${orgName}${
        branch ? " - " + branch : ""
      }.`,
      url: "https://yourdomain.com/staff/dashboard",
      type: "website",
      siteName: orgName,
      images: [
        {
          url:
            staff?.organization?.logoUrl ??
            "https://yourdomain.com/default-logo.png",
          width: 600,
          height: 400,
          alt: `${orgName} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${orgName} | ${staffName}`,
      description: `${staffName}'s dashboard for managing gym operations at ${orgName}.`,
      images: [
        staff?.organization?.logoUrl ??
          "https://yourdomain.com/default-logo.png",
      ],
    },
  };
}

const StaffLayout = ({ children }) => {
  return (
    <div className="w-full">
      <LoggedInStaffProvider>
        <ReactQueryClientProvider>
          <StaffHeader />
          <div className="dark:bg-gray-900">{children}</div>
        </ReactQueryClientProvider>
      </LoggedInStaffProvider>
    </div>
  );
};

export default StaffLayout;
