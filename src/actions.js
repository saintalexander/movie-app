// actions.js
export const swipeRight = (movieId, index) => {
  return {
    type: 'SWIPE_RIGHT',
    payload: { movieId, index }
  };
};

export const swipeLeft = () => {
  return {
    type: 'SWIPE_LEFT'
  };
};

export const swipeUp = () => {
  return {
    type: 'SWIPE_UP'
  };
};
