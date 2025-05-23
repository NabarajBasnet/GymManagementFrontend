import RootUserHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";

const MemberLayout = ({ children }) => {

    return (
        <div className='w-full'>
                <ReactQueryClientProvider>
                    <RootUserHeader />
                    {children}
                </ReactQueryClientProvider>
        </div>
    );
}

export default MemberLayout;