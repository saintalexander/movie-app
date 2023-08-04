import { useState, useEffect } from "react";

const useFetchTrailer = (id, type) => {
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const baseUrl = 'https://api.themoviedb.org/3/';
    const endPoint = type === 'TV' ? `tv/${id}/videos` : `movie/${id}/videos`;
    const url = `${baseUrl}${endPoint}`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`
      }
    };

    fetch(url, options)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((data) => {
        setTrailer(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [id, type]);

  return { trailer, loading, error };
};

export default useFetchTrailer;
