import React, { useState, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';

const API_KEY = 'ad82ec89168667e5ce9d481959e1e57f';
const PopularMoviesEndpoint = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Advanced = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useRef([]);
  const buttonSwipeRef = useRef(false);

  const fetchMovies = async () => {
    try {
      const response = await fetch(PopularMoviesEndpoint);
      const data = await response.json();
      const popularMovies = data.results.map(movie => ({ ...movie, source: 'Popular' }));
      const shuffledMovies = shuffleArray(popularMovies);
      setMovies(shuffledMovies);
      setCurrentIndex(shuffledMovies.length - 1);
      childRefs.current = Array(shuffledMovies.length).fill(0).map(() => React.createRef());
    } catch (error) {
      console.log('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const canGoBack = currentIndex < movies.length - 1;
  const canSwipe = currentIndex >= 0;

  const swipe = (dir) => {
    if (canSwipe && currentIndex < movies.length) {
      if (childRefs.current[currentIndex] && childRefs.current[currentIndex].current) {
        buttonSwipeRef.current = true;
        childRefs.current[currentIndex].current.swipe(dir);
        buttonSwipeRef.current = false;
        setCurrentIndex((prevIndex) => prevIndex - 1);
      } else {
        console.log(`Ref not available for index ${currentIndex}`);
      }
    } else {
      console.log('Cannot swipe');
    }
  };

  const goBack = () => {
    if (!canGoBack) return;

    const newIndex = currentIndex + 1;
    const cardRef = childRefs.current[newIndex];

    if (cardRef && cardRef.current) {
      cardRef.current.restoreCard();
    }

    setCurrentIndex(newIndex);
  };

  const swiped = (direction, movie, index) => {
    console.log('Swiped function called.');
    setLastDirection(direction);
    if (!buttonSwipeRef.current) {
      setCurrentIndex(index - 1);
    }
  
    if (direction === 'right') {
      fetchRecommendedMovies(movie.id);
    }
  };

  const fetchRecommendedMovies = async (movieId) => {
    const recommendedEndpoint = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`;
    try {
      const response = await fetch(recommendedEndpoint);
      const data = await response.json();
      const recommendedMovies = data.results.filter((movie) => !movies.some((m) => m.id === movie.id));

      if (recommendedMovies.length >= 2 && currentIndexRef.current >= 3) {
        const recommendedMoviesWithSource = recommendedMovies.map(movie => ({ ...movie, source: 'Recommended' }));
        setMovies((prevMovies) => {
          const newMovies = [...prevMovies];
          const twoRecommendedMovies = recommendedMoviesWithSource.slice(0, 2);
          newMovies.splice(currentIndexRef.current - 3, 2, ...twoRecommendedMovies);
          return newMovies;
        });
      } else {
        console.log('Cannot fetch recommended movies. Less than 3 cards until start of array or bottom of stack.');
      }
    } catch (error) {
      console.log('Error fetching recommended movies:', error);
    }
  };

  return (
    <div>
      <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Alatsi&display=swap" rel="stylesheet" />
      <h1>React Tinder Card</h1>
      <div className="cardContainer">
        {movies.map((movie, index) => (
          <TinderCard
            ref={childRefs.current[index]}
            className="swipe"
            key={movie.id}
            onSwipe={(dir) => swiped(dir, movie, index)}
            onCardLeftScreen={() => {}}
            swipeRequirementType="position"
          >
            <div
              style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})` }}
              className="card"
            >
              <h3>{movie.title}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>
          Swipe left!
        </button>
        <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={goBack}>
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
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
      <div className="arrayList">
        <h2>Array List</h2>
        <ul>
          {movies.map((movie, index) => (
            <li
              key={movie.id}
              style={{ color: index === currentIndex ? 'green' : 'black' }}
            >
              <span>Movie ID: {movie.id}</span>
              <span>Movie Name: {movie.title}</span>
              <span>Source: {movie.source || 'Popular'}</span>
            </li>
          ))}
        </ul>
        <p>Total number of items in array: {movies.length}</p>
      </div>
    </div>
  );
};

export default Advanced;
