import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost/movieproject-api';

const VideoForm = ({ userId, movieId, tmdbApiKey }) => {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    site: '',
    videoKey: '',
    videoType: '',
    official: 0,
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [videoList, setVideoList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/videos', {
        userId,
        movieId,
        ...formData,
      });
      setStatusMessage('Video added successfully!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setStatusMessage('Failed to add video. Please try again.');
    }
  };

  const fetchVideos = async () => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US&api_key=${tmdbApiKey}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { accept: 'application/json' },
      });
      const data = await response.json();
      if (data.results) {
        setVideoList(data.results);
        setStatusMessage('Videos fetched successfully!');
      } else {
        setStatusMessage('No videos found for this movie.');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('Failed to fetch videos. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add a Video</h2>
      <button onClick={fetchVideos}>Fetch Videos from TMDB</button>
      {videoList.length > 0 && (
        <div>
          <h3>Fetched Videos:</h3>
          <ul>
            {videoList.map((video) => (
              <li key={video.id}>
                <strong>{video.name}</strong> ({video.type}) - {video.site}
                <br />
                Video Key: {video.key}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>URL:</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Site:</label>
          <input
            type="text"
            name="site"
            value={formData.site}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Video Key:</label>
          <input
            type="text"
            name="videoKey"
            value={formData.videoKey}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Video Type:</label>
          <input
            type="text"
            name="videoType"
            value={formData.videoType}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Official:</label>
          <select
            name="official"
            value={formData.official}
            onChange={handleChange}
            required
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>
        <button type="submit">Add Video</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default VideoForm;
