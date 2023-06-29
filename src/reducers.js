import { combineReducers } from 'redux';
import { swipeLeft, swipeRight, swipeUp } from './actions';

const moviesReducer = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_MOVIES_SUCCESS':
      return action.payload;
    default:
      return state;
  }
};

const recommendedReducer = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_RECOMMENDED_SUCCESS':
      return action.payload;
    default:
      return state;
  }
};
const currentIndexReducer = (state = 0, action) => {
  switch (action.type) {
    case 'movies/swipeLeft': // Update the action type
      return Math.max(0, state - 1);
    case 'movies/swipeRight': // Update the action type
    case 'movies/swipeUp': // Update the action type
      return state + 1;
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  movies: moviesReducer,
  recommended: recommendedReducer,
  currentIndex: currentIndexReducer,
});

export default rootReducer;
