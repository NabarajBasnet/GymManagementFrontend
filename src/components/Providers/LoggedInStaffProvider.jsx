'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

const StaffContext = createContext();

const LoggedInStaffProvider = ({ children }) => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);

    const getLoggedInStaffDetails = async () => {
        try {
            const response = await fetch(`https://38ff26b62e8fb10c5911b95dbbd1747b.serveo.net/api/loggedin-staff`, {
                credentials: 'include',
            });
            if (response.ok) {
                const responseBody = await response.json();
                setStaff(responseBody);
            } else {
                setStaff(null);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setStaff(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLoggedInStaffDetails();
    }, []);

    return (
        <StaffContext.Provider value={{ staff, loading }}>
            {children}
        </StaffContext.Provider>
    );
};

export const useStaff = () => {
    return useContext(StaffContext);
};

export default LoggedInStaffProvider;
