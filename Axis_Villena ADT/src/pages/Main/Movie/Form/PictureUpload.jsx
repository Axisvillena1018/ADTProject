import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PictureUpload.css";

const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NzcyMWQwZGMyNjA5NTgzMGUwNTMzMWJlOTUyMmZlZSIsIm5iZiI6MTczMzMxMjA3Mi42NDUsInN1YiI6IjY3NTAzZTQ4NDNhNmFiZDA2YjZlYjYzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.g9SuizCUJ7Ikbf6tKraKj0EI8S10qVtRv0aCqBqueqE";
const TMDB_BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const PictureUpload = () => {
  const [movieId, setMovieId] = useState("");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

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
          Authorization: `Bearer ${TMDB_API_KEY}`,
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

  const handleSubmit = async () => {
    const url = images.length > 0 ? `${IMAGE_BASE_URL}${images[currentIndex].file_path}` : '';
    const data = { movieId, url, description };
    setStatus('loading');
    console.log(data);
  
    try {
      const token = localStorage.getItem('accessToken'); 
      const res = await axios({
        method: 'post',
        url: '/admin/photos',
        data,
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      alert('Upload successful.');
      setStatus('idle');
    } catch (e) {
      console.log(e);
      setStatus('idle');
      alert(e.response?.data?.message || 'Error.');
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
      <div className="description-section">
        <textarea
          placeholder="Add a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
};

export default PictureUpload;
