"use client";

import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const { isAuthenticated, login, checkAuthorization } = useAuth();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                await checkAuthorization(); // Since it returns void, we don't need to handle the response
                if (isAuthenticated)
                {
                    router.push('/');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error checking authorization:', error);
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [router, isAuthenticated]);

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError("Please fill in all fields.");
                return;
            }

            const response = await login(email, password, rememberMe);

            if (response.ok) {
                router.push('/');
            } else {
                setError('Login failed. Please check your email and password and try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    if (loading) {
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
        <Container maxWidth="sm" style={{ height: '90vh', position: 'relative' }}>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Login
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            handleLogin();
                        }
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Remember Me"
                    style={{ alignSelf: 'flex-start', paddingBottom: '8px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                >
                    Login
                </Button>

                <Box mt={2} width="100%">
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
