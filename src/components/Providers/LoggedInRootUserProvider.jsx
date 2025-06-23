'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

const RootUserContext = createContext();

const LoggedInRootUserProvider = ({ children }) => {

    const [rootUser, setRootUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getLoggedInRootUserDetails = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/rootuser/details`, {
                credentials: 'include',
            });

            const responseBody = await response.json();
            if (response.ok) {
                setRootUser(responseBody.rootUser);
            } else {
                setRootUser(null);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setRootUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLoggedInRootUserDetails();
    }, []);

    return (
        <RootUserContext.Provider value={{ rootUser, loading }}>
            {children}
        </RootUserContext.Provider>
    );
};

export const useRootUser = () => {
    return useContext(RootUserContext);
};

export default LoggedInRootUserProvider;
