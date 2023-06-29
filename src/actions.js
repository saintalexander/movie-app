// actions.js
export const swipeRight = (movieId, index) => {
  return {
    type: 'movies/swipeRight', // Update the action type
    payload: { movieId, index }
  };
};

export const swipeLeft = () => {
  return {
    type: 'movies/swipeLeft' // Update the action type
  };
};

export const swipeUp = () => {
  return {
    type: 'SWIPE_UP'
  };
};
