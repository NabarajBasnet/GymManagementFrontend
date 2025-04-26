import { jwtDecode } from "jwt-decode";
import { cookies } from 'next/headers';

const getTokenDetails = async () => {
    try {
        const memberLoginToken = await cookies().get('memberLoginToken')?.value || '';

        if (!memberLoginToken) {
            console.log('No token found');
            return null;
        }

        const decodedToken = jwtDecode(memberLoginToken);

        return decodedToken;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export default getTokenDetails;