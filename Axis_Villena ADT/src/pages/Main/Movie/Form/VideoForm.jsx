import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VideoForm.css';

const VideoForm = () => {
  const [query, setQuery] = useState(''); // Search query state
  const [movieId, setMovieId] = useState(null); // Selected movie ID
  const [videos, setVideos] = useState([]); // Video data
  const [savedVideos, setSavedVideos] = useState([]); // Saved videos
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
            Authorization: 'Bearer <your_api_token>',
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
            Authorization: 'Bearer <your_api_token>',
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

  // Save video details locally
  const saveVideo = (video) => {
    const videoDetails = {
      id: Date.now(), // Unique ID for saved video
      userId: '12345', // Example userId (replace with actual user logic)
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

  // Submit video data to database using Axios
  const handleSubmitToDatabase = async (videoDetails) => {
    try {
      const token = localStorage.getItem('authToken'); // Retrieve token from local storage
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
              <button
                onClick={() => {
                  const videoDetails = {
                    id: Date.now(), // Unique ID
                    userId: '12345', // Example userId
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

      {/* Display saved videos */}
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
