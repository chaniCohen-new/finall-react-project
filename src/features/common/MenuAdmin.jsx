import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

const MenuAdminComponent = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/home');
    };

    const handleLearningClick = () => {
        navigate('/lessons');
    };

    const handleUsersClick = () => {
        navigate('/users');
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

                    <PeopleIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleUsersClick}>משתמשים</Button>

                    <SchoolIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleLearningClick}>למידה</Button>

                    <Button color="inherit" onClick={() => navigate('/admin/questions')}>📝 ניהול שאלות</Button>
                </Box>
                
                <Box marginLeft="auto">
                    <ExitToAppIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleLogoutClick}>יציאה</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MenuAdminComponent;