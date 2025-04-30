const useMember = () => {

    // Get all members
    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://https://gymmanagementbackend-o2l3.onrender.com:3000/api/members`);
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
            const response = await fetch(`http://https://gymmanagementbackend-o2l3.onrender.com:3000/api/members/${memberId}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            return error
        };
    };

    // Update member details
    const updateMemberDetails = async ({ memberId, data }) => {
        try {
            const response = await fetch(`http://https://gymmanagementbackend-o2l3.onrender.com:3000/api/members/${memberId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include',
            })
            return response.json();
        } catch (error) {
            console.log("Error: ", error);
            return error;
        }
    }

    return { getAllMembers, getSingleUserDetails, updateMemberDetails };
}

export default useMember;
