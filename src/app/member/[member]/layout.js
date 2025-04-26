import MemberHeader from "./Header";
import toast, { Toaster } from 'react-hot-toast';

const MemberLayout = ({ children }) => {
    return (
        <div className='w-full'>
            <MemberHeader />
            {children}
        </div>
    );
}

export default MemberLayout;