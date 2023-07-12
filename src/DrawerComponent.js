import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useMediaQuery, useTheme } from '@mui/material';
import ModalComponent from './ModalComponent';
import GridNavigation from './GridNavigation';

const DrawerComponent = ({ open, handleDrawerToggle, likedItems }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDrawerClose = () => {
    handleDrawerToggle();
  };

  const handleCardClick = (index) => {
    setSelectedItemIndex(index);
  };

  const handleModalClose = () => {
    setSelectedItemIndex(null);
  };

  const handleModalNavigation = (index) => {
    setSelectedItemIndex(index);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  };

  const drawerWidth = isMobile ? '100vw' : '50vw'; // Adjust width based on device type

  const itemsInViewport = isMobile ? 3 : 8;

  return (
    <>
      <ModalComponent
        selectedItemIndex={selectedItemIndex}
        handleModalClose={handleModalClose}
        handleModalNavigation={handleModalNavigation}
        likedItems={likedItems}
        drawerWidth={drawerWidth} // Pass drawerWidth as a prop to ModalComponent
      />
      <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
        <div
          style={{
            width: drawerWidth,
            height: '100vh',
            backgroundColor: 'white',
            padding: '0rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', // Prevent horizontal scrolling
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              color="inherit"
              aria-label="close drawer"
              edge="end"
              onClick={handleDrawerClose}
              style={{
                borderRadius: '50%',
                padding: '8px',
                margin: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="simple tabs example"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <Tab label="Liked" style={{ width: '50%', justifyContent: 'center', display: 'flex' }} />
            <Tab
              label="Recommended"
              style={{ width: '50%', justifyContent: 'center', display: 'flex' }}
            />
          </Tabs>
          <GridNavigation items={likedItems} handleCardClick={handleCardClick} itemsInViewport={itemsInViewport} />
          <TabPanel value={tabValue} index={1}>
            {/* Populate your recommended items here */}
          </TabPanel>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerComponent;
