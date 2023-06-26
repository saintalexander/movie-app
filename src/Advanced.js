import React, { useState, useEffect, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import ColorThief from 'colorthief';
import { fetchMovies, fetchRecommendedMovies } from './movieService';
import IconButton from '@mui/material/IconButton';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import UndoIcon from '@mui/icons-material/Undo';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SkipNextIcon from '@mui/icons-material/SkipNext';

function Advanced() {
  const [movies, setMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const [childRefs, setChildRefs] = useState([]);

  useEffect(() => {
    setChildRefs((refs) =>
      Array(movies.length + recommendedMovies.length)
        .fill()
        .map((_, index) => refs[index] || React.createRef())
    );
  }, [movies.length, recommendedMovies.length]);

  const [gradient, setGradient] = useState('');

  useEffect(() => {
    const fetchMoviesData = async () => {
      const fetchedMovies = await fetchMovies();
      setMovies(fetchedMovies);
      setCurrentIndex(fetchedMovies.length - 1);
      const refs = Array(fetchedMovies.length).fill(0).map(() => React.createRef());
      setChildRefs(refs);
    };

    fetchMoviesData();
  }, []);

  useEffect(() => {
    const fetchRecommendedData = async () => {
      if (movies[currentIndex]) {
        const fetchedRecommendedMovies = await fetchRecommendedMovies(
          movies[currentIndex].id,
          movies // Pass the 'movies' array as an argument
        );
        setRecommendedMovies(fetchedRecommendedMovies);
      }
    };
  
    fetchRecommendedData();
  }, [currentIndex, movies]);
  

  useEffect(() => {
    const fetchColor = async () => {
      const color = await fetchDominantColor(movies[currentIndex]?.url);
      const gradientStart = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`;
      const gradientEnd = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      const generatedGradient = `linear-gradient(${gradientStart} 33%, ${gradientEnd} 67%)`;
      setGradient(generatedGradient);
    };

    fetchColor();
  }, [currentIndex, movies]);

  const currentMovie = movies[currentIndex] || {};

  const fetchDominantColor = async (url) => {
    const colorThief = new ColorThief();
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    return new Promise((resolve) => {
      img.onload = function () {
        const color = colorThief.getColor(this);
        resolve(color);
      };

      img.src = url;
    });
  };

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < movies.length - 1;
  const canSwipe = currentIndex >= 0;

  const MAX_MOVIES_TO_ADD = 2; // Define the maximum number of movies to add

  const swiped = async (direction, movieId, index) => {
    setLastDirection(direction);
    
    if (direction === 'right') {
      // Find the current movie's index by matching the movie ID
      const currentMovieIndex = movies.findIndex((movie) => movie.id === movieId);
    
      if (currentMovieIndex >= 0) {
        const likedMovie = movies[currentMovieIndex];
    
        // Calculate the splice index
        let spliceIndex = Math.max(0, currentMovieIndex - 1); 
    
        // Pass the existing movies to the fetchRecommendedMovies function
        const recommended = await fetchRecommendedMovies(likedMovie.id, movies, MAX_MOVIES_TO_ADD);
    
        if (recommended.length > 0) {
          const updatedMovies = [
            ...movies.slice(0, spliceIndex),
            ...recommended,
            ...movies.slice(spliceIndex)
          ];
    
          setMovies(updatedMovies);
    
          // Set the current index to the card which was next before adding the recommended movies.
          // Given that we add recommended movies before the next card and move towards the start of the array, 
          // we need to account for the length of the added recommended movies array to land on the correct card.
          const newCurrentIndex = spliceIndex + recommended.length; 
          setCurrentIndex(newCurrentIndex);
        }
      }
    } else if (direction === 'left') {
      // Handle swipe left (dislike)
      updateCurrentIndex(Math.max(0, index - 1));
    }
  };
  

  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before the card goes outOfFrame
    if (currentIndexRef.current >= idx && childRefs[idx]?.current) {
      childRefs[idx].current.restoreCard();
    }
    // TODO: when quickly swiping and restoring multiple times the same card,
    // multiple outOfFrame events are queued and the card disappears
    // during the latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < movies.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return (
    <div className="root" style={{ backgroundImage: gradient }}>
      <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Alatsi&display=swap" rel="stylesheet" />
      <div className="backgroundImage" style={{ backgroundImage: `url(${movies[currentIndex]?.url})` }} />
      <div className="movieArray" style={{ color: `#fff` }}>
        <span className="movieItem">
          Total Movies: {movies.length}
        </span>
        <span className="movieItem">
          Total Popular Movies: {movies.filter((movie) => movie.source === 'popular').length}
        </span>
        <span className="movieItem">
          Total Recommended Movies: {movies.filter((movie) => movie.source === 'recommended').length}
        </span>
        {movies.map((movie) => (
          <span key={movie.id} className="movieItem">
            {movie.id} - {movie.name} ({movie.source === 'popular' ? 'Popular' : 'Recommended'})
          </span>
        ))}
      </div>
      <div className="cardContainer">
        {movies.map((movie, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={movie.id}
            onSwipe={(dir) => swiped(dir, movie.id, index)}
            onCardLeftScreen={() => outOfFrame(movie.id, index)}
            swipeRequirementType="position"
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
      {currentMovie.name && (
        <div className="movieMeta">
          <div className="movieTitle">
            {currentMovie.name}
          </div>
          <div className="movieInfo">
            <p>
              {currentMovie.year} ‧ {currentMovie.genres.slice(0, 1).join(", ")}
              {currentMovie.imdbScore && (
                <a href={currentMovie.imdbLink} target="_blank" rel="noopener noreferrer">
                  <span className="imdbScore">{currentMovie.imdbScore}</span>
                </a>
              )}
            </p>
          </div>
        </div>
      )}
      <div className="buttons">
        <IconButton
          color="primary"
          disabled={!canSwipe}
          onClick={() => swipe('left')}
          aria-label="Thumb Down"
        >
          <ThumbDownIcon />
        </IconButton>

        <IconButton
          color="primary"
          disabled={!canGoBack}
          onClick={() => goBack()}
          aria-label="Undo"
          size="small"
        >
          <UndoIcon />
        </IconButton>

        <IconButton
          color="primary"
          disabled={!canSwipe}
          onClick={() => swipe('right')}
          aria-label="Thumb Up"
        >
          <ThumbUpIcon />
        </IconButton>

        <IconButton
          color="primary"
          disabled={!canSwipe}
          onClick={() => swipe('up')}
          aria-label="Skip"
        >
          <SkipNextIcon />
        </IconButton>
      </div>

      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  );
}

export default Advanced;