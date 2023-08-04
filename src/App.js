import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Advanced from './Advanced';
import DrawerComponent from './DrawerComponent';

const App = () => {
  const [open, setOpen] = useState(false);
  const [likedItems, setLikedItems] = useState([]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <div className={`app ${open ? 'drawer-open' : ''}`}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <div className="main-content">
        <Advanced setLikedItems={setLikedItems} likedItems={likedItems} handleDrawerToggle={handleDrawerToggle} />
      </div>
      <DrawerComponent open={open} handleDrawerToggle={handleDrawerToggle} likedItems={likedItems} />
    </div>
  );
};

export default App;
