import React, { useState } from 'react';
import axios from 'axios';

const PictureUpload = ({ movieId }) => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tmdbImages, setTmdbImages] = useState([]); // Store images fetched from TMDB
  const [fetchingImages, setFetchingImages] = useState(false);

  const handleSearchImages = async () => {
    setFetchingImages(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=YOUR_TMDB_API_KEY`
      );
      const data = await response.json();

      if (data.backdrops && data.backdrops.length > 0) {
        setTmdbImages(data.backdrops.map((image) => `https://image.tmdb.org/t/p/original${image.file_path}`));
      } else {
        setError('No images found for this movie.');
      }
    } catch (err) {
      setError('Failed to fetch images from TMDB.');
    } finally {
      setFetchingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pictureData = {
      userId: 1, // Assuming the user is logged in with ID 1 (this might be dynamic)
      movieId: movieId,
      url: url,
      description: description,
    };

    try {
      setLoading(true);
      setError(null);

      await axios.post('/picture/upload', pictureData);

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
      <button onClick={handleSearchImages} disabled={fetchingImages}>
        {fetchingImages ? 'Fetching Images...' : 'Search Images from TMDB'}
      </button>
      {tmdbImages.length > 0 && (
        <div>
          <h3>Select an Image</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {tmdbImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="TMDB Image"
                style={{ width: '150px', cursor: 'pointer' }}
                onClick={() => setUrl(image)}
              />
            ))}
          </div>
        </div>
      )}
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
