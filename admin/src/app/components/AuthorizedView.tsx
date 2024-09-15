import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

function AuthorizeView(props: { children: React.ReactNode }) {
    const [loading, setLoading] = useState<boolean>(true);
    const { isAuthenticated, checkAuthorization } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const authorize = async () => {
            try {
                const response = await checkAuthorization();

                if (response.status === 200) {
                    const data = await response.json();
                    setLoading(false);
                } else if (response.status === 401) {
                    router.push('/login');
                } else {
                    throw new Error(`Unexpected status code: ${response.status}`);
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Authorization check failed:", error.message);
                } else {
                    console.error("Authorization check failed:", error);
                }
                router.push('/login');
            }
        };
        if(!isAuthenticated) {
            authorize();
        }
    }, [router]);

    if (loading && !isAuthenticated) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress size={80} />
            </Box>
        );
    }

    return (
        <>
            <Navbar />
            {props.children}
        </>
    );
}

export default AuthorizeView;
