import React, { useState, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import ColorThief from 'colorthief';
import IconButton from '@mui/material/IconButton';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import UndoIcon from '@mui/icons-material/Undo';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const API_KEY = 'ad82ec89168667e5ce9d481959e1e57f';
const PopularMoviesEndpoint = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const GenresEndpoint = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

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
  const [genres, setGenres] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useRef([]);
  const buttonSwipeRef = useRef(false);
  const [gradient, setGradient] = useState('');

  const fetchMovies = async () => {
    try {
      const response = await fetch(PopularMoviesEndpoint);
      const data = await response.json();
      const popularMovies = data.results.map(movie => ({
        ...movie,
        source: 'Popular',
        releaseYear: movie.release_date.split('-')[0], // Extract release year
        imdbScore: movie.vote_average, // IMDb score
        genreIds: movie.genre_ids, // Genre IDs
        imdbLink: `https://www.imdb.com/title/${movie.id}`, // IMDb link with movie ID
      }));
      const shuffledMovies = shuffleArray(popularMovies);
      setMovies(shuffledMovies);
      setCurrentIndex(shuffledMovies.length - 1);
      childRefs.current = Array(shuffledMovies.length).fill(0).map(() => React.createRef());
    } catch (error) {
      console.log('Error fetching movies:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch(GenresEndpoint);
      const data = await response.json();
      const genresData = {};
      data.genres.forEach(genre => {
        genresData[genre.id] = genre.name;
      });
      setGenres(genresData);
    } catch (error) {
      console.log('Error fetching genres:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchGenres();
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
      const recommendedMovies = data.results.filter((movie) => {
        // Filter out movies that already exist in the main array
        if (movies.some((m) => m.id === movie.id)) {
          return false;
        }
        // Check for missing important metadata
        if (!movie.poster_path || !movie.genre_ids || !movie.release_date) {
          return false;
        }
        // Add additional filtering conditions based on your preferences
        // For example, you can filter movies with a minimum average vote of 7.0
        return movie.vote_average >= 7.0;
      });
  
      if (recommendedMovies.length >= 2 && currentIndexRef.current >= 3) {
        const recommendedMoviesWithSource = recommendedMovies.map((movie) => ({
          ...movie,
          source: 'Recommended',
          releaseYear: movie.release_date.split('-')[0],
          imdbScore: movie.vote_average,
          genreIds: movie.genre_ids,
          imdbLink: `https://www.imdb.com/title/${movie.id}`,
        }));
        setMovies((prevMovies) => {
          const newMovies = [...prevMovies];
          const twoRecommendedMovies = recommendedMoviesWithSource.slice(0, 2);
          newMovies.splice(currentIndexRef.current - 3, 2, ...twoRecommendedMovies);
          return newMovies;
        });
      } else {
        console.log('Cannot fetch recommended movies. Less than 3 cards until the start of the array or bottom of the stack.');
      }
    } catch (error) {
      console.log('Error fetching recommended movies:', error);
    }
  };
  
  

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
      const color = await fetchDominantColor(`https://image.tmdb.org/t/p/w500/${movies[currentIndex]?.poster_path}`);
      const gradientStart = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`;
      const gradientEnd = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      const generatedGradient = `linear-gradient(${gradientStart} 33%, ${gradientEnd} 67%)`;
      setGradient(generatedGradient);
    };

    fetchColor();
  }, [currentIndex, movies]);

  return (
    <div className="root" style={{ backgroundImage: gradient }}>
     {movies[currentIndex] && (
        <div
        className="backgroundImage"
        style={{
          backgroundImage: `url(${movies[currentIndex]?.poster_path ? `https://image.tmdb.org/t/p/w500/${movies[currentIndex].poster_path}` : 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&auto=format&fit=crop&w=2940&q=80'})`,
          transition: 'background-image 0.5s ease-in-out',
        }}
      />
      )}
      <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Alatsi&display=swap" rel="stylesheet" />
      
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
            </div>
          </TinderCard>
        ))}
      </div>

      <div className="movieMeta">
        {movies[currentIndex] && (
          <>
            <div className="movieTitle">
            <span className="ellipsis">{movies[currentIndex].title}</span>
            </div>
            <div className="movieInfo">
              <p>
                {movies[currentIndex].releaseYear} ‧ {movies[currentIndex].genreIds.map(genreId => genres[genreId]).slice(0, 1).join(", ")} 
                {movies[currentIndex].imdbScore && (
                <a href={movies[currentIndex].imdbLink} target="_blank" rel="noopener noreferrer">
                <span className="imdbScore">
                  {movies[currentIndex].imdbScore % 1 === 0
                    ? movies[currentIndex].imdbScore.toFixed(0)
                    : movies[currentIndex].imdbScore.toFixed(1)}
                </span>
              </a>
                )}
              </p>
            </div>
          </>
        )}
      </div>
      
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

      {/* <div className="arrayList">
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
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )} */}
    </div>
  );
};

export default Advanced;
