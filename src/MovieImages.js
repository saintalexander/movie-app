import React, { useEffect, useState } from 'react';

const MovieImages = ({ movieId, type }) => {
  const [backdropImage, setBackdropImage] = useState(null);

  useEffect(() => {
    const fetchMovieImages = async () => {
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        const lowerCaseType = type === 'Movie' ? 'movie' : 'tv'; // Convert type to lowercase
        const response = await fetch(
          `https://api.themoviedb.org/3/${lowerCaseType}/${movieId}?api_key=${apiKey}&language=en-US`
        );
        const data = await response.json();
        console.log('Fetched movie images:', data); // Log the fetched data for verification
        const imagePath = data.backdrop_path || data.poster_path;
        if (imagePath) {
          setBackdropImage(imagePath);
        }
      } catch (error) {
        console.error('Error fetching movie images:', error);
      }
    };

    fetchMovieImages();
  }, [movieId, type]);

  return (
    <div>
      {backdropImage ? (
        <img
          src={`https://image.tmdb.org/t/p/w780/${backdropImage}`}
          alt="Backdrop Image"
          style={{   position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover', }}
        />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default MovieImages;
