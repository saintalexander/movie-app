import React, { useState, useEffect, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import ColorThief from 'colorthief';
import { fetchMovies } from './movieService';

function Advanced() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(() => Array(movies.length).fill(0).map(() => React.createRef()), [movies]);

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

  useEffect(() => {
    const fetchColor = async () => {
      const color = await fetchDominantColor(movies[currentIndex]?.url);
      const gradientStart = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`;
      const gradientEnd = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      setGradient(`linear-gradient(${gradientStart} 33%, ${gradientEnd} 67%)`);
    };

    fetchColor();
  }, [currentIndex, movies]);

  useEffect(() => {
    const getMovies = async () => {
      const movies = await fetchMovies();
      setMovies(movies);
    };

    getMovies();
  }, []);

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
    currentIndexRef.current >= newIndex && childRefs[newIndex].current.restoreCard();
  };

  const currentMovie = movies[currentIndex] || {};
  const [gradient, setGradient] = useState('');

  return (
    <div className="root" style={{ backgroundImage: gradient }}>
      <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Alatsi&display=swap" rel="stylesheet" />
      <div className="backgroundImage" style={{ backgroundImage: `url(${currentMovie.url})` }} />
      <h1> </h1>
      <div className="cardContainer">
        {movies.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            flickOnSwipe={true}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
            preventSwipe={['up', 'down']}
            swipeRequirementType="position"
          >
            <div
              style={{ backgroundImage: `url(${character.url})` }}
              className={`card ${currentIndex === index ? 'current' : ''}`}
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>
          Swipe left!
        </button>
        <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>
          Undo swipe!
        </button>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>
          Swipe right!
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get the Restore Card button visible!
        </h2>
      )}
    </div>
  );
}

export default Advanced;
