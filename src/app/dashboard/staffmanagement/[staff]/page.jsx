import StaffDetails from "../StaffDetails";

const Staff = async ({ params }) => {

    const { staff } = await params;
    const staffId = staff;

    return (
        <div>
            <StaffDetails staffId={staffId} />
        </div>
    )
}

export default Staff;
