import { cookies } from "next/headers";

export async function generateMetadata() {
  const cookieStore = cookies();
  const token = cookieStore.get("loginToken")?.value;

  const res = await fetch(`http://localhost:3000/api/auth/me`, {
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

const MemberTransfer = () => {
  return (
    <div>
      <h1>Member Transfer</h1>
    </div>
  );
};

export default MemberTransfer;
