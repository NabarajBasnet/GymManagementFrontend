const useMember = () => {

    // Get all members
    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/members`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            return error
        };
    };

    // Get single user details
    const getSingleUserDetails = async (memberId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/members/${memberId}`);
            const responseBody = await response.json();
            console.log("BODY: ", responseBody);
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            return error
        };
    };

    return { getAllMembers, getSingleUserDetails };
}

export default useMember;
