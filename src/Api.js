import axios from 'axios';

const API_KEY = 'ad82ec89168667e5ce9d481959e1e57f';

const tmdbInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

let moviePage = 1;
let tvPage = 1;

export const fetchItems = async () => {
  const TrendingMoviesEndpoint = `/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=en-US&page=${moviePage}&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=2000`;
  const TrendingTVShowsEndpoint = `/discover/tv?api_key=${API_KEY}&include_adult=false&language=en-US&page=${tvPage}&sort_by=popularity.desc&vote_average.gte=7&vote_count.gte=2000`;

  try {
    const [moviesResponse, tvShowsResponse] = await Promise.all([
      tmdbInstance.get(TrendingMoviesEndpoint),
      tmdbInstance.get(TrendingTVShowsEndpoint),
    ]);

    moviePage++; // Increment the movie page number for the next fetch
    tvPage++; // Increment the TV show page number for the next fetch

    const shuffledMovies = shuffleArray(moviesResponse.data.results.filter((item) => item.original_language !== 'hi'));
    const shuffledTvShows = shuffleArray(tvShowsResponse.data.results);

    const movies = await Promise.all(
      shuffledMovies.slice(0, 20).map(async (item) => {
        return {
          ...item,
          id: item.id,
          title: item.title,
          originalTitle: item.original_title,
          description: item.overview,
          backdropPath: item.backdrop_path,
          posterPath: item.poster_path,
          releaseDate: item.release_date,
          releaseYear: item.release_date ? item.release_date.split('-')[0] : '',
          adult: item.adult,
          video: item.video,
          originalLanguage: item.original_language,
          genreIds: item.genre_ids,
          popularity: item.popularity,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
          type: 'Movie',
          source: 'Trending',
          imdbRating: item.vote_average.toFixed(1), // Use TMDB rating as IMDb rating
        };
      })
    );

    const tvShows = await Promise.all(
      shuffledTvShows.slice(0, 10).map(async (item) => {
        return {
          ...item,
          id: item.id,
          title: item.name,
          originalTitle: item.original_name,
          description: item.overview,
          backdropPath: item.backdrop_path,
          posterPath: item.poster_path,
          firstAirDate: item.first_air_date,
          releaseYear: item.first_air_date ? item.first_air_date.split('-')[0] : '',
          originalLanguage: item.original_language,
          genreIds: item.genre_ids,
          popularity: item.popularity,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
          originCountry: item.origin_country,
          type: 'TV',
          source: 'Trending',
          imdbRating: item.vote_average.toFixed(1), // Use TMDB rating as IMDb rating
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
  const MovieGenresEndpoint = `/genre/movie/list?api_key=${API_KEY}&language=en-US`;
  const TVGenresEndpoint = `/genre/tv/list?api_key=${API_KEY}&language=en-US`;

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
