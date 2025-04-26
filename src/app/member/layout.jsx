import MemberHeader from "./Header";

export default function MemberLayout({ children }) {
    return (
        <div className='w-full'>
            <MemberHeader />
            {children}
        </div>
    );
}
