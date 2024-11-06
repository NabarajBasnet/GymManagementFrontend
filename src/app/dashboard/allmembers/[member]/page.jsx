import Member from "./Member";

export default async function MemberPage({ params }) {
    const { member } = await params;
    const memberId = member;

    return <Member memberId={memberId} />;
}
