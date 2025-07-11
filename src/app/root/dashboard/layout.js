import RootUserHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import LoggedInRootUserProvider from "@/components/Providers/LoggedInRootUserProvider";
import RootSidebar from "./RootSidebar";

export const metadata = {
  title: "Fitbinary | Root Dashboard ",
  description: "Generated by create next app",
};

const RootUserLayout = ({ children }) => {
  return (
    <div className="w-full">
      <LoggedInRootUserProvider>
        <ReactQueryClientProvider>
          <div className="w-full flex overflow-hidden">
            <div className="hidden md:flex">
              <RootSidebar />
            </div>
            <div className="w-full h-screen overflow-y-auto">
              <RootUserHeader />
              {children}
            </div>
          </div>
        </ReactQueryClientProvider>
      </LoggedInRootUserProvider>
    </div>
  );
};

export default RootUserLayout;
