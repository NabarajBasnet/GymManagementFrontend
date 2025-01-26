'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Unauthorized = () => {
    const router = useRouter();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                overflow: 'hidden',
                color: 'white',
                textAlign: 'center',
                fontFamily: 'Poppins, Arial, sans-serif',
                position: 'relative',
            }}
        >
            {/* Animation Wrapper */}
            <div
                style={{
                    position: 'relative',
                    width: '150px',
                    height: '150px',
                    marginBottom: '30px',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        animation: 'circleAnimation 4s infinite',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backdropFilter: 'blur(8px)',
                    }}
                ></div>
                <div
                    style={{
                        position: 'absolute',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        animation: 'circleAnimation 4s infinite reverse',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backdropFilter: 'blur(12px)',
                    }}
                ></div>
            </div>

            {/* Title */}
            <h1
                style={{
                    fontSize: '3rem',
                    marginBottom: '20px',
                    fontWeight: 'bold',
                    textShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
                }}
            >
                Access Denied
            </h1>

            {/* Message */}
            <p
                style={{
                    fontSize: '1.2rem',
                    marginBottom: '40px',
                    maxWidth: '400px',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.8)',
                }}
            >
                You do not have the necessary permissions to access this page. Please return to the dashboard or contact your administrator.
            </p>

            {/* Button */}
            <button
                onClick={() => router.push('/dashboard')}
                style={{
                    padding: '12px 30px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'rgba(255, 255, 255, 0.85)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
            >
                Back to Dashboard
            </button>

            {/* Animation Keyframes */}
            <style jsx>{`
                @keyframes circleAnimation {
                    0%,
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.3);
                    }
                }
            `}</style>
        </div>
    );
};

export default Unauthorized;
