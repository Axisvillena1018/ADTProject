import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CastAndCrews.css';

const CastAndCrews = () => {
  const { movieId } = useParams();
  const [castList, setCastList] = useState([]);
  const [newCast, setNewCast] = useState({
    name: '',
    url: '',
    characterName: '',
  });

  // Fetch cast data from the backend
  useEffect(() => {
    axios
      .get(`/casts/${movieId}`)
      .then((response) => {
        setCastList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching casts:', error);
      });
  }, [movieId]);

  // Handle input change for new cast
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCast((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Save a new cast member
  const handleAddCast = () => {
    if (!newCast.name || !newCast.url || !newCast.characterName) {
      alert('Please fill in all fields.');
      return;
    }

    const data = { ...newCast, movieId };

    axios
      .post('/casts', data)
      .then((response) => {
        alert('Cast added successfully!');
        setCastList((prevList) => [...prevList, response.data]);
        setNewCast({ name: '', url: '', characterName: '' });
      })
      .catch((error) => {
        console.error('Error adding cast:', error);
        alert('Failed to add cast. Please try again.');
      });
  };

  // Delete a cast member
  const handleDeleteCast = (id) => {
    axios
      .delete(`/casts/${id}`)
      .then(() => {
        alert('Cast deleted successfully!');
        setCastList((prevList) => prevList.filter((cast) => cast.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting cast:', error);
        alert('Failed to delete cast. Please try again.');
      });
  };

  return (
    <div className="cast-and-crews">
      <h1>Cast & Crews for Movie ID: {movieId}</h1>

      <div className="add-cast">
        <h2>Add New Cast</h2>
        <form>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newCast.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Image URL:</label>
            <input
              type="text"
              name="url"
              value={newCast.url}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Character Name:</label>
            <input
              type="text"
              name="characterName"
              value={newCast.characterName}
              onChange={handleInputChange}
            />
          </div>
          <button type="button" onClick={handleAddCast}>
            Add Cast
          </button>
        </form>
      </div>

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
    </div>
  );
};

export default CastAndCrews;