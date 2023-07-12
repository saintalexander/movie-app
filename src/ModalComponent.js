import React from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { KeyboardArrowLeft, KeyboardArrowRight, Close as CloseIcon } from '@mui/icons-material';
import { useSwipeable } from 'react-swipeable';
import MovieImages from './MovieImages';

const ModalContent = ({ item }) => (
  <div style={{ position: 'relative', textAlign: 'center' }}>
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '46.67%', // 3:2 aspect ratio
        overflow: 'hidden',
        boxShadow: '0 0 0 1px #dadce0',
      }}
    >
      <MovieImages movieId={item.id} type={item.type} />
    </div>
    <h2
      style={{
        margin: '1rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: '2',
        WebkitBoxOrient: 'horizontal',
        color: '#70757a',
      }}
    >
      {item.title}
    </h2>
    <p>{item.description}</p>
  </div>
);

const ModalComponent = ({ selectedItemIndex, handleModalClose, handleModalNavigation, likedItems, drawerWidth }) => {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleModalNavigation('next'),
    onSwipedRight: () => handleModalNavigation('prev'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleNavigation = (direction) => {
    if (direction === 'next') {
      handleModalNavigation(selectedItemIndex === likedItems.length - 1 ? 0 : selectedItemIndex + 1);
    } else if (direction === 'prev') {
      handleModalNavigation(selectedItemIndex === 0 ? likedItems.length - 1 : selectedItemIndex - 1);
    }
  };

  return (
    <Dialog
      open={selectedItemIndex !== null}
      onClose={handleModalClose}
      classes={{ paper: 'custom-modal-paper' }}
      PaperProps={{ style: { margin: '0', height: '100vh', position: 'fixed', right: '0', maxHeight: 'unset', maxWidth: 'unset', } }}
    >
      <div {...swipeHandlers} style={{ width: drawerWidth, position: 'relative' }}>
        {selectedItemIndex !== null && (
          <>
            <IconButton
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#fff',
                zIndex: '1',
                backgroundColor: 'rgb(255, 255, 255, 0.1)',
              }}
              onClick={handleModalClose}
            >
              <CloseIcon />
            </IconButton>
            <ModalContent item={likedItems[selectedItemIndex]} />
            <IconButton
              disabled={selectedItemIndex === 0}
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',  color: '#fff', backgroundColor: 'rgb(255, 255, 255, 0.1)', }}
              onClick={() => handleNavigation('prev')}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              disabled={selectedItemIndex === likedItems.length - 1}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',  color: '#fff', backgroundColor: 'rgb(255, 255, 255, 0.1)', }}
              onClick={() => handleNavigation('next')}
            >
              <KeyboardArrowRight />
            </IconButton>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default ModalComponent;
