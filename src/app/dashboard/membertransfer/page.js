import { cookies } from "next/headers";
import MemberTransfer from "./membertransfer";

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
    title: `${orgName} | Member Transfer`,
  };
}

const MemberTransferSSR = () => {
  return <MemberTransfer />;
};

export default MemberTransferSSR;
