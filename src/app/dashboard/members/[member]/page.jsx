import MemberDetails from "../MemberDetails";

const Member = async ({ params }) => {

    const { member } = await params;
    const memberId = member;

    return (
        <MemberDetails memberId={memberId} />
    )
}

export default Member;
