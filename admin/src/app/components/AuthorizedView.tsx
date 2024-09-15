import React, { useState, useEffect, createContext } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { checkAuthorization } from '../services/authService';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

const UserContext = createContext({});

interface User {
    email: string;
}

function AuthorizeView(props: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User>({ email: "" });

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const authorize = async () => {
            try {
                const response = await checkAuthorization();

                if (response.status === 200) {
                    const data = await response.json();
                    setUser({ email: data.email });
                    setAuthorized(true);
                } else if (response.status === 401) {
                    router.push('/login');
                } else {
                    throw new Error(`Unexpected status code: ${response.status}`);
                }
            } catch (error: any) {
                console.error("Authorization check failed:", error.message);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        authorize();
    }, [router]);

    useEffect(() => {
        if (!loading && !authorized) {
            router.push('/login');
        }
    }, [loading, authorized, router]);

    if (loading || !authorized) {
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
            {pathname !== '/login' && <Navbar />}
            <UserContext.Provider value={user}>
                {props.children}
            </UserContext.Provider>
        </>
    );
}

export default AuthorizeView;
