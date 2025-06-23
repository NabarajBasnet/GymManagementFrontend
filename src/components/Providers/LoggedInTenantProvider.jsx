'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


const TenantContext = createContext();

const LoggedInTenantProvider = ({ children }) => {

    const router = useRouter();
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const loggedInTenant = tenant?.tenant;

    let [organizationDetailsSetupCompleted, setOrganizationDetailsSetupCompleted] = useState(false);

    useEffect(() => {
        if (loggedInTenant?.onboardingCompleted !== undefined) {
            setOrganizationDetailsSetupCompleted(loggedInTenant?.onboardingCompleted);
        }
    }, [loggedInTenant]);

    const getLoggedInTenantDetails = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/tenant/details`, {
                credentials: 'include',
            });
            if (response.ok) {
                const responseBody = await response.json();
                setTenant(responseBody);
            } else {
                setTenant(null);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setTenant(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLoggedInTenantDetails();
    }, []);

    return (
        <TenantContext.Provider value={{ tenant, loading }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    return useContext(TenantContext);
};

export default LoggedInTenantProvider;
