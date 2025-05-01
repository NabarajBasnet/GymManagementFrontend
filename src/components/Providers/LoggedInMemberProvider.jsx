'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

const MemberContext = createContext();

const LoggedInMemberProvider = ({ children }) => {

    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    const getLoggedInMemberDetails = async () => {
        try {
            const response = await fetch(`https://7232397b19d1ad937691d5b90ab2d795.serveo.net/api/member/details`, {
                credentials: 'include',
            });
            if (response.ok) {
                const responseBody = await response.json();
                setMember(responseBody);
            } else {
                setMember(null);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setMember(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLoggedInMemberDetails();
    }, []);

    return (
        <MemberContext.Provider value={{ member, loading }}>
            {children}
        </MemberContext.Provider>
    );
};

export const useMember = () => {
    return useContext(MemberContext);
};

export default LoggedInMemberProvider;
