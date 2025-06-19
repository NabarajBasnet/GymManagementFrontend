import LoggedInStaffProvider from "@/components/Providers/LoggedInStaffProvider";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import StaffHeader from "./Header";

const StaffLayout = ({ children }) => {
  return (
    <div className="w-full">
      <LoggedInStaffProvider>
        <ReactQueryClientProvider>
          <StaffHeader />
          <div className="dark:bg-gray-900">{children}</div>
        </ReactQueryClientProvider>
      </LoggedInStaffProvider>
    </div>
  );
};

export default StaffLayout;
