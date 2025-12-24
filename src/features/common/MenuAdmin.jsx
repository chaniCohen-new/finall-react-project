import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School'; // לשמור על האייקון לשימוש בלמידה
import PeopleIcon from '@mui/icons-material/People'; // אייקון לשימושים
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

const MenuAdminComponent = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/'); // ניווט לדף הבית
    };

    const handleLearningClick = () => {
        navigate('/learning'); // ניווט לדף הלמידה
    };

    const handleUsersClick = () => {
        navigate('/users'); // ניווט לדף המשתמשים
    };

    const handleLogoutClick = () => {
        navigate(-1); // ניווט לדף הקודם
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" flexGrow={1}>
                    <HomeIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleHomeClick}>בית</Button>

                    <PeopleIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleUsersClick}>משתמשים</Button>

                    <SchoolIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleLearningClick}>למידה</Button>
                </Box>
                
                {/* כפתור היציאה בצד ימין */}
                <Box marginLeft="auto">
                    <ExitToAppIcon color="inherit" style={{ margin: '0 10px' }} />
                    <Button color="inherit" onClick={handleLogoutClick}>יציאה</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MenuAdminComponent;