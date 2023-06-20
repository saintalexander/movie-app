import React, { useState, useEffect, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import ColorThief from 'colorthief';
import { fetchMovies } from './movieService';
import IconButton from '@mui/material/IconButton';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import UndoIcon from '@mui/icons-material/Undo';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';


function Advanced() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(() => Array(movies.length).fill(0).map(() => React.createRef()), [movies]);
  const [gradient, setGradient] = useState('');

  useEffect(() => {
    const getMovies = async () => {
      const fetchedMovies = await fetchMovies();
      setMovies(fetchedMovies);
      setCurrentIndex(fetchedMovies.length - 1);
    };

    getMovies();
  }, []);

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

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
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

  return (
    <div className="root" style={{ backgroundImage: gradient }}>
      <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Alatsi&display=swap" rel="stylesheet" />
      <div className="backgroundImage" style={{ backgroundImage: `url(${currentMovie.url})` }} />
      
      <div className="cardContainer">
        {movies.map((movie, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={movie.id}
            onSwipe={(dir) => swiped(dir, movie.id, index)}
            onCardLeftScreen={() => outOfFrame(movie.id, index)}
            preventSwipe={['up', 'down']}
            swipeRequirementType="position"
          >
            <div
              style={{ backgroundImage: `url(${movie.url})` }}
              className={`card ${currentIndex === index ? 'current' : ''}`}
            >
             
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