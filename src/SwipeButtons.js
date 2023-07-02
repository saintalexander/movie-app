import React from 'react';
import IconButton from '@mui/material/IconButton';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

const SwipeButtons = ({ swipe, goBack, canSwipe, canGoBack, isSwipeLeftFulfilled, isSwipeRightFulfilled }) => {
  return (
    <div className="swipeButtons">
      {canGoBack && (
        <IconButton onClick={goBack}>
          <UndoIcon style={{ color: isSwipeRightFulfilled ? "green" : "gray" }} fontSize="large" />
        </IconButton>
      )}
      {canSwipe && (
        <>
          <IconButton onClick={() => swipe('left')}>
            <ThumbDownOutlinedIcon style={{ color: isSwipeLeftFulfilled ? "red" : "gray" }} fontSize="large" />
          </IconButton>
          <IconButton onClick={() => swipe('right')}>
            <ThumbUpOutlinedIcon style={{ color: isSwipeRightFulfilled ? "green" : "gray" }} fontSize="large" />
          </IconButton>
        </>
      )}
    </div>
  );
}

export default SwipeButtons;
