import axios from 'axios';

const API_KEY = 'ad82ec89168667e5ce9d481959e1e57f';

export const fetchMovies = async () => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results.map((movie) => ({
      name: movie.title,
      url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};
