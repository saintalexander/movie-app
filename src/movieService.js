import axios from 'axios';

const API_KEY = 'ad82ec89168667e5ce9d481959e1e57f'; // Replace with your actual API key

const getYear = (releaseDate) => {
  return new Date(releaseDate).getFullYear();
};

export const fetchMovies = async () => {
  try {
    const genresResponse = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: API_KEY,
      },
    });
    const genres = genresResponse.data.genres.reduce((obj, item) => {
      obj[item.id] = item.name;
      return obj;
    }, {});

    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: API_KEY,
        page: 1,
        language: 'en-US',
      },
    });
    const movies = response.data.results.slice(0, 8);

    const imdbPromises = movies.map((movie) =>
      axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/external_ids`, {
        params: {
          api_key: API_KEY,
        },
      })
    );
    const imdbResponses = await Promise.all(imdbPromises);
    const imdbScores = imdbResponses.map((imdbResponse) => imdbResponse.data.imdb_id);

    return movies.map((movie, index) => ({
      id: movie.id,
      name: movie.title,
      url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      year: getYear(movie.release_date),
      genres: movie.genre_ids.slice(0, 3).map((id) => genres[id]).filter(Boolean),
      imdbScore: imdbScores[index] ? movie.vote_average : null,
      imdbLink: imdbScores[index] ? `https://www.imdb.com/title/${imdbScores[index]}` : null,
      source: 'popular',
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchRecommendedMovies = async (movieId, existingMovies, limit = 5) => {
  try {
    const genresResponse = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: API_KEY,
      },
    });
    const genres = genresResponse.data.genres.reduce((obj, item) => {
      obj[item.id] = item.name;
      return obj;
    }, {});

    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar`, {
      params: {
        api_key: API_KEY,
        page: 1,
        language: 'en-US',
      },
    });

    const recommendedMovies = response.data.results.slice(0, limit);

    return recommendedMovies.map((movie) => ({
      id: movie.id,
      name: movie.title,
      url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      year: getYear(movie.release_date),
      genres: movie.genre_ids.slice(0, 3).map((id) => genres[id]).filter(Boolean),
      imdbScore: movie.vote_average,
      imdbLink: `https://www.imdb.com/title/${movie.imdb_id}`,
      source: 'recommended',
    }));
  } catch (error) {
    console.error('Error fetching recommended movies:', error);
    return [];
  }
};
