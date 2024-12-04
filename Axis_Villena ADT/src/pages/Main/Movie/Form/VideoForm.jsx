import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VideoForm.css';

const VideoForm = () => {
  const [query, setQuery] = useState(''); // Search query state
  const [movieId, setMovieId] = useState(null); // Selected movie ID
  const [videos, setVideos] = useState([]); // Video data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error message state

  // Fetch movieId based on search query
  const searchMovie = async () => {
    if (query.trim() === '') return; // Prevent empty search

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US`,
        {
          headers: {
            Accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGY0ZjFlMmNhODQ1ZjA3NWY5MmI5ZDRlMGY3ZTEwYiIsIm5iZiI6MTcyOTkyNjY3NC40NzIwOTksInN1YiI6IjY3MTM3ODRmNjUwMjQ4YjlkYjYxZTgxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RRJNLOg8pmgYoomiCWKtwkw74T3ZtAs7ZScqxo1bzWg',
          },
        }
      );

      // If movie is found, set movieId
      if (response.data.results.length > 0) {
        setMovieId(response.data.results[0].id); // Choose the first movie
      } else {
        setError('No movies found.');
      }
    } catch (error) {
      console.error('Error searching movie:', error);
      setError('Failed to fetch movie data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch video data based on movieId
  useEffect(() => {
    if (!movieId) return; // Don't fetch videos if there's no movieId

    const fetchVideos = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios({
          method: 'get',
          url: `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
          headers: {
            Accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGY0ZjFlMmNhODQ1ZjA3NWY5MmI5ZDRlMGY3ZTEwYiIsIm5iZiI6MTcyOTkyNjY3NC40NzIwOTksInN1YiI6IjY3MTM3ODRmNjUwMjQ4YjlkYjYxZTgxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RRJNLOg8pmgYoomiCWKtwkw74T3ZtAs7ZScqxo1bzWg',
          },
        });
        setVideos(response.data.results);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to fetch videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [movieId]);

  return (
    <div className="video-form">
      <h2>Search for Movie Videos</h2>

      {/* Search input */}
      <div className="search">
        <input
          type="text"
          placeholder="Enter movie name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchMovie} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Display error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Display loading spinner */}
      {loading && <p>Loading...</p>}

      {/* Display videos */}
      {videos.length > 0 ? (
        <div className="video-list">
          {videos.map((video) => (
            <div className="video-item" key={video.id}>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${video.key}`}
                title={video.name}
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <p>{video.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No videos available.</p>
      )}
    </div>
  );
};

export default VideoForm;
