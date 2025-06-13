'use client';

import { IoIosClose } from "react-icons/io";
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
            const response = await fetch(`http://localhost:3000/api/tenant/details`, {
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
            {/* {!organizationDetailsSetupCompleted && (
                <div className="fixed bottom-20 left-1/2 transform z-50 -translate-x-1/2 w-full max-w-xl px-4">
                    <div className="bg-red-600 text-white shadow-xl rounded-2xl flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                                🚀 Complete your organization setup to unlock full features.
                            </span>
                            <button
                                onClick={() => router.push("/clientarea/settings")}
                                className="underline hover:text-blue-200 text-sm font-medium transition"
                            >
                                Go to Settings
                            </button>
                        </div>
                        <IoIosClose
                            className="w-4 h-4 cursor-pointer text-white"
                            onClick={() => setOrganizationDetailsSetupCompleted(true)}
                        />
                    </div>
                </div>
            )} */}
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    return useContext(TenantContext);
};

export default LoggedInTenantProvider;
