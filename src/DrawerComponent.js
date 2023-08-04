import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
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

  const itemsInViewport = isMobile ? 3 : 8;

  const TabPanel = ({ children, value, index }) => {
    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`}>
        {value === index && children}
      </div>
    );
  };

  DrawerComponent.propTypes = {
    open: PropTypes.bool,
    handleDrawerToggle: PropTypes.func.isRequired,
    likedItems: PropTypes.array.isRequired
  };

  return (
    <>
      <ModalComponent
        selectedItemIndex={selectedItemIndex}
        handleModalClose={handleModalClose}
        handleModalNavigation={handleModalNavigation}
        likedItems={likedItems}
        drawerWidth="100vw"
      />
      <Dialog
        open={open}
        onClose={handleDrawerClose}
        fullScreen
        fullWidth
        maxWidth="xl"
        PaperProps={{
          style: { backgroundColor: 'white', padding: 0, overflow: 'hidden' },
        }}
      >
        <DialogTitle>
          <IconButton
            color="inherit"
            aria-label="close drawer"
            edge="start"
            onClick={handleDrawerClose}
            style={{
              color: '#000',
              backgroundColor: 'rgb(0, 0, 0, 0.05)',
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="simple tabs example"
            style={{ justifyContent: 'space-between', marginBottom: '2rem' }}
          >
            <Tab label="Liked" style={{ width: '50%', justifyContent: 'center', display: 'flex' }} />
            <Tab
              label="Recommended"
              style={{ width: '50%', justifyContent: 'center', display: 'flex' }}
            />
          </Tabs>
          <div style={{ color: '#000', font: '20px/26px Google Sans,Roboto,Helvetica Neue,Arial,sans-serif' }}>
            Top picks for you
          </div>
          <GridNavigation items={likedItems} handleCardClick={handleCardClick} itemsInViewport={itemsInViewport} />
          <TabPanel value={tabValue} index={1}>
            {/* Populate your recommended items here */}
          </TabPanel>
        </DialogContent>
        <DialogActions>
          {/* Add your actions here */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DrawerComponent;
