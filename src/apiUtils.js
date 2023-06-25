import axios from 'axios';
import { addItemToArray, removeDuplicatesFromArray } from './arrayUtils';

const API_KEY = 'ad82ec89168667e5ce9d481959e1e57f';
const MIN_IMDB_SCORE = 7.0;
const MIN_VOTE_COUNT = 500;

// Fetch 8 random popular movies from TMDB API
export async function fetchRandomPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const response = await axios.get(url);
    const movies = response.data.results;
    const filteredMovies = filterByImdbScoreAndVoteCount(movies, MIN_IMDB_SCORE, MIN_VOTE_COUNT);
    const randomMovies = getRandomMovies(filteredMovies, 8);
    const formattedMovies = randomMovies.map((movie) => ({
      ...formatMovieData(movie),
      source: 'popular', // Add source property to indicate the endpoint
    }));
    return formattedMovies;
  } catch (error) {
    console.error('Error fetching random popular movies:', error);
    return [];
  }
}

// Fetch recommended movies based on a given movie ID
export async function fetchRecommendedMovies(movieId, existingMovies) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`;

  try {
    const response = await axios.get(url);
    const recommendedMovies = response.data.results;
    const filteredMovies = filterByImdbScoreAndVoteCount(recommendedMovies, MIN_IMDB_SCORE, MIN_VOTE_COUNT);
    const uniqueMovies = removeDuplicatesFromArray(filteredMovies, 'id');
    const nonDuplicateMovies = uniqueMovies.filter(movie => !existingMovies.some(existingMovie => existingMovie.id === movie.id));
    const limitedMovies = nonDuplicateMovies.slice(0, 3); // Limit to a maximum of three movies
    return limitedMovies.map(formatMovieData);
  } catch (error) {
    console.error(`Error fetching recommended movies for movie with ID ${movieId}:`, error);
    return [];
  }
}

// Helper function to filter movies by IMDb score and vote count
function filterByImdbScoreAndVoteCount(movies, minScore, minVoteCount) {
  return movies.filter((movie) => movie.vote_average >= minScore && movie.vote_count >= minVoteCount);
}

// Helper function to select random movies from the response
function getRandomMovies(movies, count) {
  const shuffled = movies.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to format movie data
function formatMovieData(movie) {
  return {
    id: movie?.id,
    poster: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
    title: movie?.title,
    releaseYear: movie?.release_date?.slice(0, 4),
    genre: movie?.genres?.[0]?.name,
    imdbScore: movie?.vote_average,
    imdbURL: movie?.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}` : '',
    // Additional properties you want to include
  };
}

// Helper function to get the API endpoint based on the movie's source
export function getMovieApiEndpoint(movie) {
  if (movie.source === 'popular') {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
  } else if (movie.source === 'recommendations') {
    return `https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`;
  } else {
    return 'Unknown API Endpoint';
  }
}
