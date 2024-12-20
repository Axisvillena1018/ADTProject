import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CastNCrews.css';

const CastAndCrews = () => {
  const { movieId } = useParams();
  const [castList, setCastList] = useState([]);
  const [selectedCast, setSelectedCast] = useState({
    id: '',
    name: '',
    characterName: '',
    url: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const searchCasts = () => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NzcyMWQwZGMyNjA5NTgzMGUwNTMzMWJlOTUyMmZlZSIsIm5iZiI6MTczMzMxMjA3Mi42NDUsInN1YiI6IjY3NTAzZTQ4NDNhNmFiZDA2YjZlYjYzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.g9SuizCUJ7Ikbf6tKraKj0EI8S10qVtRv0aCqBqueqE`,
          Accept: 'application/json',
        },
      })
      .then((response) => {
        const results = response.data.cast || [];
        setCastList(
          results.map((cast) => ({
            id: cast.id,
            name: cast.name,
            characterName: cast.character,
            url: cast.profile_path
              ? `https://image.tmdb.org/t/p/w500${cast.profile_path}`
              : 'https://via.placeholder.com/96',
          }))
        );
      })
      .catch((error) => {
        console.error('Error fetching casts:', error);
        alert('Failed to fetch cast. Please try again.');
      });
  };

  const handleSelectCast = (cast) => {
    setSelectedCast(cast);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCast((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedCast.name || !selectedCast.characterName || !selectedCast.url) {
      alert('Please fill in all fields before submitting.');
      return;
    }
  
    const castData = {
      movieId: movieId,
      name: selectedCast.name,
      characterName: selectedCast.characterName,
      url: selectedCast.url,
    };
  
    try {
      const token = localStorage.getItem('accessToken'); 
  
      if (!token) {
        alert('Access token not found. Please log in again.');
        return;
      }
  
      const response = await axios({
        method: 'POST',
        url: '/admin/casts',
        data: castData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert('Cast added successfully!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting cast:', error.response?.data || error.message);
      alert(`Failed to add cast. Error: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  const filteredCastList = castList.filter((cast) =>
    cast.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="cast-and-crews">
      <h1>Cast for Movie ID: {movieId}</h1>

      <div className="search-cast">
        <h2>Search Cast</h2>
        <input
          type="text"
          placeholder="Search Cast by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={searchCasts}>Search on TMDB</button>
      </div>

      <div className="cast-list">
        <h2>Cast List</h2>
        <div className="cast-item-container">
          {filteredCastList.map((cast) => (
            <div
              key={cast.id}
              className="cast-item"
              onClick={() => handleSelectCast(cast)}
            >
              <img src={cast.url} alt={cast.name} />
              <div>
                <h3>{cast.name}</h3>
                <p>Character: {cast.characterName}</p>
                <button onClick={() => handleSelectCast(cast)}>Add Cast</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="selected-cast-form">
        <h2>Selected Cast</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={selectedCast.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Character Name:</label>
            <input
              type="text"
              name="characterName"
              value={selectedCast.characterName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Image URL:</label>
            <input
              type="url"
              name="url"
              value={selectedCast.url}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Submit Cast</button>
        </form>
      </div>
    </div>
  );
};

export default CastAndCrews;
