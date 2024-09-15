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
        const checkAuthStatus = async () => {
            if (!isAuthenticated) {
                const response = await checkAuthorization();
                if (!response.ok) {
                    router.push('/login');
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        
        checkAuthStatus();
    }, [isAuthenticated, checkAuthorization, router]);

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
