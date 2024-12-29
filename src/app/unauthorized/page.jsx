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
                background: 'linear-gradient(135deg, #ff6f61, #5a69e0)',
                overflow: 'hidden',
                color: 'white',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
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
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        animation: 'circleAnimation 3s infinite',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                ></div>
                <div
                    style={{
                        position: 'absolute',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.15)',
                        animation: 'circleAnimation 3s infinite reverse',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                ></div>
            </div>

            {/* Title */}
            <h1
                style={{
                    fontSize: '2.5rem',
                    marginBottom: '15px',
                }}
            >
                Unauthorized Access
            </h1>

            {/* Message */}
            <p
                style={{
                    fontSize: '1.2rem',
                    marginBottom: '30px',
                    maxWidth: '400px',
                }}
            >
                Oops! You don't have permission to view this page.
            </p>

            {/* Button */}
            <button
                onClick={() => router.push('/dashboard')}
                style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#5a69e0',
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                }}
            >
                Go Back to Dashboard
            </button>

            {/* Animation Keyframes */}
            <style jsx>{`
                @keyframes circleAnimation {
                    0%,
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
};

export default Unauthorized;
