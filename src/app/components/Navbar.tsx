'use client';

import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar position="static" sx={{ width: '80%', margin: '10px auto' }}>
      <Container maxWidth={false} sx={{ padding: 0}}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h5" sx={{}}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                  key={'Home'}
                  color="inherit"
                  onClick={() => handleNavigation('/')}
                >
                  <Typography>{'Home'}</Typography>
            </Button>
            {['Products', 'Categories', 'Orders'].map((text) => (
              <Button
                key={text}
                color="inherit"
                onClick={() => handleNavigation(`/${text.toLowerCase()}`)}
              >
                <Typography>{text}</Typography>
              </Button>
            ))}
            <Button
              color="inherit"
              onClick={handleLogout}
            >
              <Typography>Logout</Typography>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
