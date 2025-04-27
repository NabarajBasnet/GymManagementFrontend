import LoggedInMemberProvider from "@/components/Providers/LoggedInMemberProvider";
import MemberHeader from "./Header";

const MemberLayout = ({ children }) => {

    return (
        <div className='w-full'>
            <LoggedInMemberProvider>
                <MemberHeader />
                {children}
            </LoggedInMemberProvider>
        </div>
    );
}

export default MemberLayout;