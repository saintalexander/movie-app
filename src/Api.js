import axios from 'axios';

const API_KEY = 'ad82ec89168667e5ce9d481959e1e57f';

// Get a random page number between 1 and 3
const getRandomPage = () => Math.floor(Math.random() * 4) + 1;

const TrendingMoviesEndpoint = `/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=en-US&page=${getRandomPage()}&sort_by=popularity.desc&vote_average.gte=6.4&vote_count.gte=1000&with_original_language=en`;
const TrendingTVShowsEndpoint = `/discover/tv?api_key=${API_KEY}&first_air_date.gte=1990-01-01&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${getRandomPage()}&sort_by=popularity.desc&vote_average.gte=8&vote_count.gte=1000&with_original_language=en`;
const MovieGenresEndpoint = `/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const TVGenresEndpoint = `/genre/tv/list?api_key=${API_KEY}&language=en-US`;

const tmdbInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

export const fetchItems = async () => {
  try {
    const [moviesResponse, tvShowsResponse] = await Promise.all([
      tmdbInstance.get(TrendingMoviesEndpoint),
      tmdbInstance.get(TrendingTVShowsEndpoint),
    ]);

    const shuffledMovies = shuffleArray(moviesResponse.data.results);
    const shuffledTvShows = shuffleArray(tvShowsResponse.data.results);

    const movies = await Promise.all(
      shuffledMovies.slice(0, 20).map(async (item) => {
        const imdbId = await fetchIMDbId(item.id, 'movie');
        const tmdbRating = item.vote_average;
        const imdbRating = await fetchIMDbRating(imdbId, tmdbRating);
        return {
          ...item,
          type: 'Movie',
          source: 'Trending',
          releaseYear: item.release_date ? item.release_date.split('-')[0] : '',
          imdbId,
          imdbRating,
          genreIds: item.genre_ids,
          imdbLink: `https://www.imdb.com/title/${imdbId}`,
        };
      })
    );

    const tvShows = await Promise.all(
      shuffledTvShows.slice(0, 10).map(async (item) => {
        const imdbId = await fetchIMDbId(item.id, 'tv');
        const tmdbRating = item.vote_average;
        const imdbRating = await fetchIMDbRating(imdbId, tmdbRating);
        return {
            ...item,
            title: item.name,
            type: 'TV',
            source: 'Trending',
            releaseYear: item.first_air_date ? item.first_air_date.split('-')[0] : '',
            imdbId,
            imdbRating,
            genreIds: item.genre_ids,
            imdbLink: `https://www.imdb.com/title/${imdbId}`,
          };
        })
    );

    return shuffleArray([...movies, ...tvShows]);
  } catch (error) {
    console.log('Error fetching items:', error);
    return [];
  }
};

export const fetchGenres = async () => {
  try {
    const [movieGenresResponse, tvGenresResponse] = await Promise.all([
      tmdbInstance.get(MovieGenresEndpoint),
      tmdbInstance.get(TVGenresEndpoint),
    ]);

    const genresData = {};
    movieGenresResponse.data.genres.forEach((genre) => {
      genresData[genre.id] = genre.name;
    });
    tvGenresResponse.data.genres.forEach((genre) => {
      genresData[genre.id] = genre.name;
    });

    return genresData;
  } catch (error) {
    console.log('Error fetching genres:', error);
    return {};
  }
};

const fetchIMDbId = async (tmdbId, mediaType) => {
  try {
    const response = await tmdbInstance.get(`/${mediaType}/${tmdbId}?api_key=${API_KEY}&language=en-US&append_to_response=external_ids`);
    return response.data.external_ids.imdb_id || '';
  } catch (error) {
    console.log(`Error fetching IMDb ID for TMDb ID ${tmdbId}:`, error);
    return '';
  }
};

const fetchIMDbRating = async (imdbId, tmdbRating) => {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?i=${imdbId}&apikey=f301d071`);
    const imdbRating = response.data.imdbRating;
    return imdbRating !== 'N/A' ? imdbRating : tmdbRating;
  } catch (error) {
    console.log(`Error fetching IMDb rating for IMDb ID ${imdbId}:`, error);
    return tmdbRating;
  }
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
