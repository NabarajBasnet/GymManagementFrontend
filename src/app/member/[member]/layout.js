import LoggedInMemberProvider from "@/components/Providers/LoggedInMemberProvider";
import MemberHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";

const MemberLayout = ({ children }) => {

    return (
        <div className='w-full'>
            <LoggedInMemberProvider>
                <ReactQueryClientProvider>
                    <MemberHeader />
                    {children}
                </ReactQueryClientProvider>
            </LoggedInMemberProvider>
        </div>
    );
}

export default MemberLayout;