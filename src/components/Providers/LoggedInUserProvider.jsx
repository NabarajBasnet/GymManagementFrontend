'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const LoggedInUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getLoggedInUserDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/me`, {
                credentials: 'include',
            });
            if (response.ok) {
                const responseBody = await response.json();
                setUser(responseBody);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLoggedInUserDetails();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

export default LoggedInUserProvider;
