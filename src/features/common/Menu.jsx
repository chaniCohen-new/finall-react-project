import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

const MenuComponent = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/home');
    };

    const handleCoursesClick = () => {
        navigate('/lessons');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogoutClick = () => {
        navigate(-1);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#9CA3AF' }}>
            <Toolbar>
                <Box display="flex" flexGrow={1}>
                    <HomeIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleHomeClick}>בית</Button>

                    <SchoolIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleCoursesClick}>קורסים</Button>

                    <PersonIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleProfileClick}>איזור אישי</Button>
                </Box>
                
                <Box marginLeft="auto">
                    <ExitToAppIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleLogoutClick}>יציאה</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MenuComponent;