import LoggedInMemberProvider from "@/components/Providers/LoggedInMemberProvider";
import MemberHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const token = cookieStore.get("memberLoginToken")?.value;

  const res = await fetch(`http://localhost:3000/api/member/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  const member = data?.loggedInMember;

  const orgName = member?.organization?.name ?? "Gym";
  const memberName = member?.fullName ?? "Member";
  const branch = member?.organizationBranch?.orgBranchName ?? "";

  return {
    title: `${orgName} | ${memberName}`,
    description: `Welcome ${memberName} to your member portal at ${orgName}${
      branch ? " - " + branch : ""
    }. View your membership details, payments, and more.`,
    keywords: [
      memberName,
      orgName,
      "Gym Membership",
      "Fitness Dashboard",
      "Gym Nepal",
      "Gym Management",
    ],
    openGraph: {
      title: `${orgName} | ${memberName}`,
      description: `Manage your gym membership and activities at ${orgName}${
        branch ? " - " + branch : ""
      }.`,
      url: "https://yourdomain.com/member",
      type: "website",
      siteName: orgName,
      images: [
        {
          url:
            member?.organization?.logoUrl ??
            "https://yourdomain.com/default-logo.png",
          width: 600,
          height: 400,
          alt: `${orgName} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${orgName} | ${memberName}`,
      description: `Access your gym membership dashboard and stay fit with ${orgName}.`,
      images: [
        member?.organization?.logoUrl ??
          "https://yourdomain.com/default-logo.png",
      ],
    },
  };
}

const MemberLayout = ({ children }) => {
  return (
    <div className="w-full">
      <LoggedInMemberProvider>
        <ReactQueryClientProvider>
          <MemberHeader />
          {children}
        </ReactQueryClientProvider>
      </LoggedInMemberProvider>
    </div>
  );
};

export default MemberLayout;
