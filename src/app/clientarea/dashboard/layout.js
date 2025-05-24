import RootUserHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import LoggedInRootUserProvider from "@/components/Providers/LoggedInRootUserProvider";
import LoggedInTenantProvider from "@/components/Providers/LoggedInTenantProvider";

const RootUserLayout = ({ children }) => {

    return (
        <div className='w-full'>
            <LoggedInRootUserProvider>
                <LoggedInTenantProvider>
                <ReactQueryClientProvider>
                    <RootUserHeader />
                    {children}
                </ReactQueryClientProvider>
                </LoggedInTenantProvider>
            </LoggedInRootUserProvider>
        </div>
    );
}

export default RootUserLayout;