import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const MenuComponent = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" flexGrow={1}>
                    <IconButton color="inherit">
                        <HomeIcon />
                    </IconButton>
                    <Button color="inherit">בית</Button>

                    <IconButton color="inherit">
                        <SchoolIcon />
                    </IconButton>
                    <Button color="inherit">קורסים</Button>

                    <IconButton color="inherit">
                        <PersonIcon />
                    </IconButton>
                    <Button color="inherit">איזור אישי</Button>
                </Box>
                
                {/* כפתור היציאה בצד ימין */}
                <Box marginLeft="auto">
                    <IconButton color="inherit">
                        <ExitToAppIcon />
                    </IconButton>
                    <Button color="inherit">יציאה</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MenuComponent;