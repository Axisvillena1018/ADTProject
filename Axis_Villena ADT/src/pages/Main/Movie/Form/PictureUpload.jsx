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
  const [description, setDescription] = useState("");

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

  const handleSubmit = async () => {
    if (images.length > 0 && description.trim()) {
      try {
        // Fetch user information dynamically
        const response = await axios.get("https://your-api-url.com/getUserInfo", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
  
        const userId = response.data.userId; // Assuming the response contains the userId
        const token = localStorage.getItem("auth_token"); // Get the Authorization token from localStorage
  
        if (!userId || !token) {
          alert("Please log in to submit an image.");
          return;
        }
  
        const photoData = {
          userid: userId,
          movieid: movieId,
          url: `${IMAGE_BASE_URL}${images[currentIndex].file_path}`,
          description,
        };
  
        // Submit the photo data to the server
        const submitResponse = await axios({
          method: 'POST',
          url: 'https://your-api-url.com/Admin/Photos', // Replace with your actual API URL
          data: photoData,
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from localStorage
          },
        });
  
        if (submitResponse.status === 200) {
          alert("Image submitted successfully!");
        }
      } catch (err) {
        console.error("Error during submission:", err);
        setError("An error occurred while submitting the image. Please try again.");
      }
    } else {
      alert("Please fetch an image and add a description before submitting.");
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
