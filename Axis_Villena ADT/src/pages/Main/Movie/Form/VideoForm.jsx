import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost/movieproject-api';

const VideoForm = ({ userId, movieId }) => {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    site: '',
    videoKey: '',
    videoType: '',
    official: 0,
  });
  const [statusMessage, setStatusMessage] = useState('');

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

  return (
    <div>
      <h2>Add a Video</h2>
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
