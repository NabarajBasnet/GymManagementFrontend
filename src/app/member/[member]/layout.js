import getTokenDetails from "@/utils/getTokenDetails";
import MemberHeader from "./Header";

const MemberLayout = ({ children }) => {
    
    return (
        <div className='w-full'>
            <MemberHeader />
            {children}
        </div>
    );
}

export default MemberLayout;