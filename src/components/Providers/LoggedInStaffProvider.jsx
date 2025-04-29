'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

const StaffContext = createContext();

const LoggedInStaffProvider = ({ children }) => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);

    const getLoggedInStaffDetails = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/loggedin-staff`, {
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
