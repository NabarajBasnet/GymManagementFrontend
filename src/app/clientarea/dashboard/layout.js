import ClientAreaHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import LoggedInTenantProvider from "@/components/Providers/LoggedInTenantProvider";

const RootUserLayout = ({ children }) => {

    return (
        <div className='w-full'>
            <LoggedInTenantProvider>
                <ReactQueryClientProvider>
                    <ClientAreaHeader />
                    <div className="w-full">
                        {children}
                    </div>
                </ReactQueryClientProvider>
            </LoggedInTenantProvider>
        </div>
    );
}

export default RootUserLayout;