import React, { useState } from 'react';
import axios from 'axios';

const PictureUpload = ({ movieId }) => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the data to be sent to the API
    const pictureData = {
      userId: 1, // Assuming the user is logged in with ID 1 (this might be dynamic)
      movieId: movieId,
      url: url,
      description: description,
    };

    try {
      setLoading(true);
      setError(null); // Reset previous errors

      // Send the data using Axios
      await axios.post('/picture/upload', pictureData);
      
      // Reset the form after successful submission
      setUrl('');
      setDescription('');
      alert('Picture uploaded successfully!');
    } catch (error) {
      setError('Failed to upload picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Picture for Movie {movieId}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">Picture URL:</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Picture'}
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default PictureUpload;
