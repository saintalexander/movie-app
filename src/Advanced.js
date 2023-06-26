import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TinderCard from 'react-tinder-card';
import ColorThief from 'colorthief';
import { fetchMovies, fetchRecommendedMovies } from './movieService';
import { swipeRight, swipeLeft, swipeUp } from './actions';
import IconButton from '@mui/material/IconButton';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import UndoIcon from '@mui/icons-material/Undo';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const Advanced = () => {
  const movies = useSelector((state) => state.movies);
  const currentIndex = useSelector((state) => state.currentIndex);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMoviesData = async () => {
      const fetchedMovies = await fetchMovies();
      dispatch({ type: 'FETCH_MOVIES_SUCCESS', movies: fetchedMovies });
    };

    fetchMoviesData();
  }, [dispatch]);

  const swiped = async (direction, movieId, index) => {
    if (direction === 'right') {
      const likedMovie = movies.find((movie) => movie.id === movieId);
      const recommended = await fetchRecommendedMovies(likedMovie.id, movies);
      const newIndex = currentIndex + 1;
      dispatch(swipeRight(recommended, newIndex));
    } else if (direction === 'left') {
      dispatch(swipeLeft());
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
  };

  const swipe = (dir) => {
    if (dir === 'right') {
      const likedMovie = movies[currentIndex];
      const newIndex = currentIndex + 1;
      dispatch(swipeRight([likedMovie], newIndex));
    } else if (dir === 'left') {
      dispatch(swipeLeft());
    } else if (dir === 'up') {
      dispatch(swipeUp());
    }
  };

  const goBack = () => {
    dispatch(swipeLeft());
  };

  const currentMovie = movies[currentIndex] || {};

  return (
    <div>
      <div className="cardContainer">
        {movies.map((movie, index) => (
          <TinderCard
            className="swipe"
            key={movie.id}
            onSwipe={(dir) => swiped(dir, movie.id, index)}
            onCardLeftScreen={() => outOfFrame(movie.name, index)}
            preventSwipe={['down']}
          >
            <div
              style={{ backgroundImage: `url(${movie.url})` }}
              className={`card ${currentIndex === index ? 'current' : ''}`}
            >
              {/* Render card content here */}
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="movieMeta">
        <div className="movieTitle">
          {currentMovie.name}
        </div>
        <div className="movieInfo">
          <p>
            {/* Render movie info here */}
            {currentMovie.year} ‧ {currentMovie.genres && currentMovie.genres.slice(0, 1).join(", ")}
            {currentMovie.imdbScore && (
              <a href={currentMovie.imdbLink} target="_blank" rel="noopener noreferrer">
                <span className="imdbScore">{currentMovie.imdbScore}</span>
              </a>
            )}
          </p>
        </div>
      </div>
      <div className="buttons">
        <IconButton color="primary" onClick={() => swipe('left')} aria-label="Thumb Down">
          <ThumbDownIcon />
        </IconButton>
        <IconButton color="primary" onClick={goBack} aria-label="Undo" size="small">
          <UndoIcon />
          <IconButton color="primary" onClick={() => swipe('up')} aria-label="Skip">
  <SkipNextIcon />
</IconButton>

        </IconButton>
        <IconButton color="primary" onClick={() => swipe('right')} aria-label="Thumb Up">
          <ThumbUpIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Advanced;
