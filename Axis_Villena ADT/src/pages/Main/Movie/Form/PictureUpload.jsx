import React, { useState } from "react";
import axios from "axios";
import "./PictureUpload.css";

const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGY0ZjFlMmNhODQ1ZjA3NWY5MmI5ZDRlMGY3ZTEwYiIsIm5iZiI6MTcyOTkyNjY3NC40NzIwOTksInN1YiI6IjY3MTM3ODRmNjUwMjQ4YjlkYjYxZTgxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RRJNLOg8pmgYoomiCWKtwkw74T3ZtAs7ZScqxo1bzWg";
const TMDB_BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"; // URL for TMDB images

const PictureUpload = () => {
  const [movieId, setMovieId] = useState("");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");

  const fetchImage = async () => {
    if (!movieId) {
      setError("Please enter a valid movie ID.");
      return;
    }
  
    try {
      const response = await axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movieId}/images`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${TMDB_API_KEY}`, // Use Bearer token for authorization
        },
      });
  
      const backdrops = response.data.backdrops;
      if (backdrops && backdrops.length > 0) {
        setImages(backdrops);
        setCurrentIndex(0);
        setError("");
      } else {
        setError("No images found for the given movie ID.");
      }
    } catch (err) {
      setError("An error occurred while fetching the image. Please try again.");
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleSubmit = () => {
    if (images.length > 0) {
      alert("Image submitted successfully!");
    } else {
      alert("Please fetch an image first.");
    }
  };

  return (
    <div className="picture-upload">
      <h1>Picture Upload</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Movie ID"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
        />
        <button onClick={fetchImage}>Fetch Images</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {images.length > 0 && (
        <div className="image-section">
          <img
            src={`${IMAGE_BASE_URL}${images[currentIndex].file_path}`}
            alt="Movie Backdrop"
          />
          <p>Image {currentIndex + 1} of {images.length}</p>
          <div className="navigation-buttons">
            <button onClick={handlePrevious} className="nav-button">Previous</button>
            <button onClick={handleNext} className="nav-button">Next</button>
          </div>
        </div>
      )}
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
};

export default PictureUpload;
