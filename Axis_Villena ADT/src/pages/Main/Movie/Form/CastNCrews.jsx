import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CastAndCrews = () => {
  const { movieId } = useParams();
  const [castList, setCastList] = useState([]);
  const [newCast, setNewCast] = useState({
    name: '',
    characterName: '',
    url: '',
  });

  // Set up a base URL for axios
  axios.defaults.baseURL = 'http://localhost/movieproject-api';

  // Set the Authorization token and Accept header for Axios requests
  axios.defaults.headers.common['Authorization'] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBtYWlsLmNvbSIsImZpcnN0TmFtZSI6InN0cmluZyIsIm1pZGRsZU5hbWUiOiJzdHJpbmciLCJsYXN0TmFtZSI6InN0cmluZyIsImNvbnRhY3RObyI6InN0cmluZyIsInJvbGUiOiJ1c2VyIn0.D-Q2rYdQe9UWDu1HWAg_i1Hg48J-tyglpXZgiAQYTl0`;
  axios.defaults.headers.common['Accept'] = '*/*'; // Only accept */*

  // Fetch cast data from the backend
  useEffect(() => {
    axios
      .get(`/admin/casts/${movieId}`)
      .then((response) => {
        setCastList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching casts:', error);
      });
  }, [movieId]);

  // Delete a cast member
  const handleDeleteCast = (id) => {
    axios
      .delete(`/admin/casts/${id}`)
      .then(() => {
        alert('Cast deleted successfully!');
        setCastList((prevList) => prevList.filter((cast) => cast.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting cast:', error);
        alert('Failed to delete cast. Please try again.');
      });
  };

  // Handle new cast member form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCast((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Create a new cast member
  const handleCreateCast = () => {
    const castData = {
      userId: 1,
      movieId: parseInt(movieId),
      name: newCast.name,
      characterName: newCast.characterName,
      url: newCast.url,
    };

    axios
      .post('/admin/casts', castData)
      .then((response) => {
        alert('Cast added successfully!');
        setCastList((prevList) => [...prevList, response.data]);
        setNewCast({
          name: '',
          characterName: '',
          url: '',
        });
      })
      .catch((error) => {
        console.error('Error creating cast:', error);
        alert('Failed to add cast. Please try again.');
      });
  };

  return (
    <div className="cast-and-crews">
      <h1>Cast & Crews for Movie ID: {movieId}</h1>

      <div className="cast-list">
        <h2>Cast List</h2>
        {castList.map((cast) => (
          <div key={cast.id} className="cast-item">
            <img src={cast.url} alt={cast.name} style={{ width: 250, height: 250 }} />
            <div>
              <h3>{cast.name}</h3>
              <p>Character: {cast.characterName}</p>
              <button onClick={() => handleDeleteCast(cast.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="add-cast-form">
        <h2>Add a New Cast Member</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateCast();
          }}
        >
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newCast.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Character Name:</label>
            <input
              type="text"
              name="characterName"
              value={newCast.characterName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Image URL:</label>
            <input
              type="url"
              name="url"
              value={newCast.url}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add Cast</button>
        </form>
      </div>
    </div>
  );
};

export default CastAndCrews;
