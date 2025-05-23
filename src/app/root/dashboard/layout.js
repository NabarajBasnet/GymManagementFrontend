import RootUserHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import LoggedInRootUserProvider from "@/components/Providers/LoggedInRootUserProvider";

const RootUserLayout = ({ children }) => {

    return (
        <div className='w-full'>
            <LoggedInRootUserProvider>
                <ReactQueryClientProvider>
                    <RootUserHeader />
                    {children}
                </ReactQueryClientProvider>
            </LoggedInRootUserProvider>
        </div>
    );
}

export default RootUserLayout;