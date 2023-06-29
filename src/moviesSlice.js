// moviesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = 'ad82ec89168667e5ce9d481959e1e57f';

// Helper function to get year from release_date
const getYear = (releaseDate) => {
  return new Date(releaseDate).getFullYear();
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  try {
    // Fetch all genres
    const genresResponse = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: API_KEY,
      },
    });
    const genres = genresResponse.data.genres.reduce((obj, item) => {
      obj[item.id] = item.name;
      return obj;
    }, {});

    // Fetch popular movies
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: API_KEY,
        page: 1,
        language: 'en-US',
      },
    });
    const movies = response.data.results.slice(0, 8); // Limit the movies to 8

    // Fetch IMDb scores for each movie
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
      source: 'popular', // Add the "source" property to indicate it's from popular movies
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    currentIndex: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    incrementIndex: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
    decrementIndex: (state) => {
      if (state.currentIndex < state.movies.length - 1) {
        state.currentIndex += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched movies to the array
        state.movies = action.payload;
        state.currentIndex = action.payload.length - 1;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const swipeRight = (movieId, index) => {
  return {
    type: 'SWIPE_RIGHT',
    payload: { movieId, index }
  };
};

export const swipeLeft = () => {
  return {
    type: 'SWIPE_LEFT'
  };
};

export const incrementIndex = () => {
  return {
    type: 'INCREMENT_INDEX'
  };
};

export const decrementIndex = () => {
  return {
    type: 'DECREMENT_INDEX'
  };
};


export const selectMovies = (state) => state.movies.movies;
export const selectCurrentIndex = (state) => state.movies.currentIndex;

export default moviesSlice.reducer;
