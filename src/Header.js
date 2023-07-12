// Header.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ handleDrawerToggle }) => {
  return (
    <AppBar position="fixed" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Add your logo or service name component here */}
          <Typography variant="h6" noWrap component="div" style={{ zIndex: '9', }}>
            recomovi
          </Typography>
        </div>
        <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
