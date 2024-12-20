import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VideoForm.css';

const VideoForm = () => {
  const [query, setQuery] = useState('');
  const [movieId, setMovieId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchMovie = async () => {
    if (query.trim() === '') return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NzcyMWQwZGMyNjA5NTgzMGUwNTMzMWJlOTUyMmZlZSIsIm5iZiI6MTczMzMxMjA3Mi42NDUsInN1YiI6IjY3NTAzZTQ4NDNhNmFiZDA2YjZlYjYzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.g9SuizCUJ7Ikbf6tKraKj0EI8S10qVtRv0aCqBqueqE',
          },
        }
      );

      if (response.data.results.length > 0) {
        setMovieId(response.data.results[0].id);
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

  useEffect(() => {
    if (!movieId) return;

    const fetchVideos = async () => {
      if (!movieId) return;
    
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NzcyMWQwZGMyNjA5NTgzMGUwNTMzMWJlOTUyMmZlZSIsIm5iZiI6MTczMzMxMjA3Mi42NDUsInN1YiI6IjY3NTAzZTQ4NDNhNmFiZDA2YjZlYjYzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.g9SuizCUJ7Ikbf6tKraKj0EI8S10qVtRv0aCqBqueqE',
            },
          }
        );
    
        if (response.data.results.length > 0) {
          setVideos(response.data.results);
        } else {
          setError('No videos found for this movie.');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to fetch videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [movieId]);

  const saveVideo = (video) => {
    const videoDetails = {
      id: Date.now(),
      movieId,
      url: `https://www.youtube.com/watch?v=${video.key}`,
      name: video.name,
      site: video.site,
      videoKey: video.key,
      videoType: video.type,
      official: video.official,
    };

    setSavedVideos((prevSaved) => [...prevSaved, videoDetails]);
  };

  const handleSubmitToDatabase = async (videoDetails) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        '/Admin/Videos',
        videoDetails,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Video submitted successfully:', response.data);
      alert('Video submitted to the database successfully!');
    } catch (error) {
      console.error('Error submitting video to the database:', error);
      alert('Failed to submit video to the database. Please try again.');
    }
  };

  return (
    <div className="video-form">
      <h2>Search for Movie Videos</h2>

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

      {error && <p className="error-message">{error}</p>}

      {loading && <p>Loading...</p>}

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
              <button
                onClick={() => {
                  const videoDetails = {
                    id: Date.now(),
                    movieId,
                    url: `https://www.youtube.com/watch?v=${video.key}`,
                    name: video.name,
                    site: video.site,
                    videoKey: video.key,
                    videoType: video.type,
                    official: video.official,
                  };
                  saveVideo(video);
                  handleSubmitToDatabase(videoDetails);
                }}
              >
                Submit Video
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No videos available.</p>
      )}

      <div className="saved-videos">
        <h3>Saved Videos</h3>
        {savedVideos.map((video) => (
          <div key={video.id}>
            <p>{video.name}</p>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              Watch
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoForm;
