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

  // Fetch cast data from TMDB API
  const searchCastsAndCrews = () => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBtYWlsLmNvbSIsImZpcnN0TmFtZSI6InN0cmluZyIsIm1pZGRsZU5hbWUiOiJzdHJpbmciLCJsYXN0TmFtZSI6InN0cmluZyIsImNvbnRhY3RObyI6InN0cmluZyIsInJvbGUiOiJ1c2VyIn0.D-Q2rYdQe9UWDu1HWAg_i1Hg48J-tyglpXZgiAQYTl0`,
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
        console.error('Error fetching casts and crews:', error);
        alert('Failed to fetch cast and crew. Please try again.');
      });
  };

  // Handle selection of a cast member
  const handleSelectCast = (cast) => {
    setSelectedCast(cast);
  };

  // Handle input change for the selected cast
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCast((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!selectedCast.name || !selectedCast.characterName || !selectedCast.url) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    // Replace with actual logic to fetch userId dynamically if needed
    const userId = 'dynamic-user-id';

    // Construct the payload
    const castData = {
      userId: userId,
      movieId: movieId,
      name: selectedCast.name,
      characterName: selectedCast.characterName,
      url: selectedCast.url,
    };

    // Send POST request to save the cast data
    axios
      .post('/Admin/Casts', castData)
      .then((response) => {
        alert('Cast added successfully!');
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error submitting cast:', error.response?.data || error.message);
        alert(`Failed to add cast. Error: ${error.response?.data?.message || 'Unknown error'}`);
      });
  };

  // Filter cast members based on the search query
  const filteredCastList = castList.filter((cast) =>
    cast.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="cast-and-crews">
      <h1>Cast & Crews for Movie ID: {movieId}</h1>

      <div className="search-cast">
        <h2>Search Cast & Crew</h2>
        <input
          type="text"
          placeholder="Search Cast by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={searchCastsAndCrews}>Search on TMDB</button>
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
